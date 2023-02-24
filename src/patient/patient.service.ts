import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../utilModules/prisma/prisma.service';
import { SavePatientDto } from './dto/savePatient.dto';
import { RpnService } from '../utilModules/rpn/rpn.service';
import { SupabaseService } from '../utilModules/supabase/supabase.service';
import { SendOptCodeDto } from './dto/SendOptCodeDto';
import { MessengerApiService } from '../utilModules/messengerApi/messengerApi.service';
import { OptCodeVerifyDto } from './dto/OptCodeVerifyDto';
import { UpdatePatientDto } from './dto/UpdatePatientDto';

@Injectable()
export class PatientService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly rpnService: RpnService,
    private readonly messengerApiService: MessengerApiService,
  ) {}
  private readonly logger = new Logger();

  async savePatientSupabase(data: SavePatientDto) {
    this.logger.log('savePatient http');

    data.phone = data.phone.replace(/[\s\(\)\+]/g, '');
    const rpnData = await this.rpnService.getRpnIin(data.iin);
    const supabasePatient = await this.supabaseService.patients.findFirst({
      where: { iin: data.iin },
    });
    const updateData: any = {
      phone: data.phone || '',
      email: data.email || '',
      region: 'Astana',
    };
    //rpnData.iin._text check
    if (!!rpnData.iin._text) {
      updateData.bdate = new Date(rpnData.birthDate._text) || null;
      updateData.firstname = rpnData.firstName._text || '';
      updateData.gender = rpnData.sex._text || '';
      updateData.lastname = rpnData.lastName._text || '';
      updateData.surname = rpnData.secondName._text || '';
      updateData.fullname = `${rpnData.lastName._text || ''} ${
        rpnData.firstName._text || ''
      } ${rpnData.secondName._text || ''}`;
    } else {
      updateData.iin = data.iin;
      updateData.firstname = 'Пациент';
    }
    if (supabasePatient.iin) {
      updateData.iin = data.iin;
    }

    await this.supabaseService.patients.update({
      where: { id: supabasePatient.id },
      data: updateData,
    });

    this.logger.log('savePatient');

    if (!supabasePatient.iin) return;

    this.logger.log('savePatient studies start');

    const studies = await this.supabaseService.studies.findFirst({
      where: {
        id: supabasePatient.id,
        SMS_status: 'PhonеNotFound',
        status: 'FINISHED',
      },
    });
    if (studies) {
      await this.supabaseService.studies.update({
        where: { id: studies.id },
        data: {
          SMS_status: 'PENDING_TO_SEND',
        },
      });
    }

    this.logger.log('savePatient end');
    return;
  }
  async patientSendOptCode(data: SendOptCodeDto) {
    const share_dicom_archive =
      await this.supabaseService.share_dicom_archive.findFirst({
        where: { token: data.token },
      });

    if (share_dicom_archive.number_of_attempts <= 3) {
      throw new HttpException(
        'Exceeded the number of attempts to request an access code',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!share_dicom_archive.token) {
      throw new HttpException('Token not found', HttpStatus.BAD_REQUEST);
    }

    const studies = await this.supabaseService.studies.findFirst({
      where: { id: share_dicom_archive.study_id },
    });

    const patients = await this.supabaseService.patients.findFirst({
      where: { id: studies.patient_id },
    });

    if (!patients.phone) {
      throw new HttpException('phone not found', HttpStatus.BAD_REQUEST);
    }

    const otpcode = String(Math.floor(100000 + Math.random() * 900000));
    this.messengerApiService.medreview_otpcode_dicom_archive({
      phone: patients.phone,
      template_arguments: { otpcode },
    });

    this.supabaseService.share_dicom_archive.update({
      where: { id: share_dicom_archive.id },
      data: {
        ...(share_dicom_archive.otp_code
          ? { otp_code: otpcode }
          : { status: 're_sent_otpcode' }),
        doctor_iin: data.doctor_iin,
        number_of_attempts: share_dicom_archive.number_of_attempts++,
      },
    });
    return;
  }
  async optCodeVerify(data: OptCodeVerifyDto) {
    const share_dicom_archive =
      await this.supabaseService.share_dicom_archive.findFirst({
        where: { token: data.token, doctor_iin: data.doctor_iin },
      });

    if (!share_dicom_archive.token) {
      throw new HttpException(
        'doctor_iin or token not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.otp_code !== share_dicom_archive.otp_code) {
      await this.supabaseService.share_dicom_archive.update({
        where: { id: share_dicom_archive.id },
        data: {
          verify_status: false,
          status: 'code_not_confirmed',
        },
      });
      throw new HttpException(
        {
          message: 'Verification code is incorrect',
          verify_status: false,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.supabaseService.share_dicom_archive.update({
      where: { id: share_dicom_archive.id },
      data: {
        verify_status: true,
        status: 'access_granted',
      },
    });

    const studies = await this.supabaseService.studies.findFirst({
      where: { id: share_dicom_archive.study_id },
    });

    return {
      message: 'Verification passed successfully',
      verify_status: true,
      archive_url: studies.archive_url,
    };
  }

  async putPatientPhone({ id, phone }: UpdatePatientDto) {
    const patientsUpdate = await this.prismaService.patients.update({
      where: { id },
      data: { phone },
    });
    const updateStatusStudies = await this.prismaService.$queryRawUnsafe(`
      UPDATE studies SET SMS_status = 
        case 
            when status =  'FINISHED' then 'PENDING_TO_SEND'
            when status != 'FINISHED' then ''
        end
      where "patient_id" = '${id}';
    `);
  }
  async updatePatientIin(id: string, iin: string) {
    const patients = await this.prismaService.patients.findUnique({
      where: { id },
    });
    if (iin !== patients.iin) return;
    const rpnData = await this.rpnService.getRpnIin(iin);
    if (!!rpnData.iin) {
      const patients = await this.prismaService.patients.findUnique({
        where: { id },
      });
      let data;
      //rpnData.iin._text check
      if (!!rpnData.iin._text) {
        data.bdate = new Date(rpnData.birthDate._text) || null;
        data.firstname = rpnData.firstName._text || '';
        data.gender = rpnData.sex._text || '';
        data.lastname = rpnData.lastName._text || '';
        data.surname = rpnData.secondName._text || '';
        data.fullname = `${rpnData.lastName._text || ''} ${
          rpnData.firstName._text || ''
        } ${rpnData.secondName._text || ''}`;
      } else {
        data.iin = data.iin;
        data.firstname = 'Пациент';
      }

      await this.prismaService.patients.update({
        where: { id },
        data,
      });
      const patient_studies = await this.prismaService.studies.findMany({
        where: { patient_id: id },
      });
      const patient_studies_status = patient_studies.map((data) => {
        return data.status === 'FINISHED';
      });
      // const patient_mod_studies = await this.prismaService.modalities.findFirst({
      //   where: { modality_study: patient_studies[0]HttpException},
      // });

    }
  }
}
