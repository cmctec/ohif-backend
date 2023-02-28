import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../utilModules/prisma/prisma.service';
import { SavePatientDto } from './dto/savePatient.dto';
import { RpnService } from '../utilModules/rpn/rpn.service';
import { SupabaseService } from '../utilModules/supabase/supabase.service';
import { SendOptCodeDto } from './dto/SendOptCodeDto';
import { MessengerApiService } from '../utilModules/messengerApi/messengerApi.service';
import { OptCodeVerifyDto } from './dto/OptCodeVerifyDto';
import { UpdatePatientDto, UpdatePatientIINDto } from './dto/UpdatePatientDto';
import { UserService } from 'src/user/user.service';
import { PdfJsReportApiService } from 'src/utilModules/pdfJsReportApi/pdfJsReportApi.service';
import { S3Service } from 'src/utilModules/s3/s3.service';
import { format } from 'date-fns';

@Injectable()
export class PatientService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly rpnService: RpnService,
    private readonly messengerApiService: MessengerApiService,
    private readonly userService: UserService,
    private readonly pdfJsReportApiService: PdfJsReportApiService,
  ) {}
  private readonly logger = new Logger();

  async savePatientSupabase(data: SavePatientDto) {
    this.logger.log('savePatient http');

    data.phone = data.phone.replace(/[\s\(\)\+]/g, '');
    const RPN = await this.rpnService.getPatientData(data.iin);
    let supabasePatient = await this.supabaseService.patients.findFirst({
      where: { iin: data.iin },
    });

    this.logger.log(`supabasePatient ${supabasePatient?.iin}`);
    const updateData = {
      phone: data.phone || '',
      email: data.email || '',
      region: 'Astana',
      iin: data.iin,
      ...RPN,
    };
    if (supabasePatient) {
      this.logger.log('savePatient update start');
      supabasePatient = await this.supabaseService.patients.update({
        where: { id: supabasePatient.id },
        data: updateData,
      });
    } else {
      this.logger.log('savePatient create start');
      supabasePatient = await this.supabaseService.patients.create({
        data: updateData,
      });
    }

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
    this.logger.log('get studies');
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
    if (!share_dicom_archive) {
      throw new HttpException(
        'share_dicom_archive not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (share_dicom_archive?.number_of_attempts > 4) {
      throw new HttpException(
        'Exceeded the number of attempts to request an access code',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!share_dicom_archive?.token) {
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
    await this.messengerApiService.medreview_otpcode_dicom_archive({
      phone: patients.phone,
      template_arguments: { otpcode },
    });

    await this.supabaseService.share_dicom_archive.update({
      where: { id: share_dicom_archive.id },
      data: {
        ...(share_dicom_archive.otp_code
          ? { status: 're_sent_otpcode' }
          : { otp_code: otpcode }),
        doctor_iin: data.doctor_iin,
        number_of_attempts: (share_dicom_archive.number_of_attempts || 0) + 1,
      },
    });
    return { message: 'OTP code re-sent successfully' };
  }
  async optCodeVerify(data: OptCodeVerifyDto) {
    const share_dicom_archive =
      await this.supabaseService.share_dicom_archive.findFirst({
        where: { token: data.token, doctor_iin: data.doctor_iin },
      });
    if (!share_dicom_archive) {
      throw new HttpException(
        'share_dicom_archive not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!share_dicom_archive.token) {
      throw new HttpException(
        'doctor_iin or token not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (data.otpcode !== share_dicom_archive.otp_code) {
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
    await this.prismaService.patients.findUnique({
      where: { id },
    });
    await this.prismaService.patients.update({
      where: { id },
      data: { phone },
    });
    await this.prismaService.$queryRawUnsafe(
      `UPDATE studies SET SMS_status = case when status =  'FINISHED' then 'PENDING_TO_SEND' when status != 'FINISHED' then '' end where "patient_id" = '${id}';`,
    );
    return { success: true };
  }
  async putPatientIIN({ id, iin }: UpdatePatientIINDto) {
    const oldData = await this.prismaService.patients.findUnique({
      where: { id },
    });
    await this.prismaService.patients.update({
      where: { id },
      data: { iin },
    });
    await this.prismaService.$queryRawUnsafe(
      `UPDATE studies SET SMS_status = case when status =  'FINISHED' then 'PENDING_TO_SEND' when status != 'FINISHED' then '' end where "patient_id" = '${id}';`,
    );
    this.updateConclusionAfterUpdatePatientData(
      { id, iin },
      { iin: oldData.iin },
    );
    return { success: true };
  }

  async updateConclusionAfterUpdatePatientData(
    data: updateConclusionAfterUpdatePatientDataDto,
    oldData: { iin: string },
  ) {
    try {
      this.logger.log('start func updateConclusionAfterUpdatePatientData');
      const patients = await this.prismaService.patients.findUnique({
        where: { id: data.id },
      });
      console.log(oldData.iin, patients.iin);
      if (oldData.iin === patients.iin) return;
      this.logger.log('updateConclusionAfterUpdatePatientData validation');

      const RPN = await this.rpnService.getPatientData(data.iin);
      this.logger.log('RPN');
      if (RPN) {
        const patients = await this.prismaService.patients.update({
          where: { id: data.id },
          data: RPN,
          include: {
            studies: {
              include: {
                appointment: true,
                conclusion: {
                  include: {
                    conclusion_image: true,
                  },
                },
                modality_study: {
                  include: {
                    modalities: true,
                    studies: true,
                  },
                },
                patients: true,
              },
            },
          },
        });
        this.logger.log('RPN success update');
        const patient_studies = patients.studies[0];
        if (patient_studies.status === 'FINISHED') {
          // TODO update all concusions
          // dont one doctor
          const user = await this.prismaService.users.findFirst({
            where: { user_name: patient_studies.conclusion[0].doctor_iin },
          });
          const user_data =
            await this.userService.getUserDataAndCheckOrganizations(
              user.user_name,
            );
          const PDF: Buffer = await this.pdfJsReportApiService.mrconclusion({
            brand_name: user_data.organization_user[0].organizations.name,
            service_name: 'Компьютерная томография',
            tell2: '+7 708 333 20 20, +7 (7172) 73 4759',
            conclusion_text: patient_studies.conclusion[0].conclusion_text,
            doctor_fullname: patient_studies.conclusion[0].doctor_fullname,
            patient_fullname: patient_studies.patients.fullname,
            patient_iin: patient_studies.patients.iin,
            research_date: format(
              patient_studies.conclusion[0].created_at,
              'mm/dd/yyyy',
            ),
            c_image: patient_studies.conclusion[0].conclusion_url,
          });
          this.logger.log('PDF success');
          await this.s3Service.updatePublicFile(
            PDF,
            'application/pdf',
            patient_studies.conclusion[0].conclusion_url,
          );
          this.logger.log('Update S3 success');
        }
      }
      const appointment = await this.prismaService.appointment.findFirst({
        where: {
          patient_iin: patients.iin,
        },
      });
      if (!appointment) return;

      const patient_studies = await this.prismaService.studies.findFirst({
        where: { patient_id: data.id },
      });
      if (!appointment.study_id) return undefined;
      await this.prismaService.appointment.update({
        where: { id: appointment.id },
        data: {
          study_id: patient_studies.id,
          status:
            patient_studies.status === 'FINISHED'
              ? 'LOADED_FROM_API'
              : 'SENT_TO_API',
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
