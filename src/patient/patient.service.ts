import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../utilModules/prisma/prisma.service';
import { SavePatientDto } from './dto/savePatient.dto';
import { RpnService } from '../utilModules/rpn/rpn.service';
import { SupabaseService } from '../utilModules/supabase/supabase.service';

@Injectable()
export class PatientService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly rpnService: RpnService,
  ) {}
  private readonly logger = new Logger();

  async savePatientSupabase(data: SavePatientDto) {
    this.logger.log('savePatient http');

    data.phone = data.phone.replace(/[\s\(\)\+]/g, '');
    const rpnData = await this.rpnService.getRpnIin(data.iin);
    const supabasePatient = await this.supabaseService.patients.findFirst({
      where: { iin: data.iin },
    });
    let updateData: any = {
      phone: data.phone || '',
      email: data.email || '',
      region: 'Astana',
    };
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
  async patientSendOptCode(id: string) {
    return await this.prismaService.patients.findUnique({ where: { id } });
  }
  async patientData(id: string) {
    return await this.prismaService.patients.findUnique({ where: { id } });
  }
}
