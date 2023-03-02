import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { GetAllStudiesDto } from './dto/getAllStudies.dto';
import { PatientService } from 'src/patient/patient.service';
import { SupabaseService } from 'src/utilModules/supabase/supabase.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { ModalitiesService } from 'src/modalities/modalities.service';

@Injectable()
export class StudiesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly supabaseService: SupabaseService,
    private readonly patientService: PatientService,
    private readonly organizationsService: OrganizationsService,
    private readonly modalitiesService: ModalitiesService,
  ) {}
  private readonly logger = new Logger();

  async getStudies(id: string) {
    this.logger.log('StudiesService studies.findUnique');
    const data = await this.prismaService.studies.findUnique({
      where: { id },
      include: {
        patients: true,
        modality_study: {
          include: {
            modalities: true,
          },
        },
        conclusion: true,
      },
    });
    if (data) return data;
    if (!data) {
      throw new HttpException(`data(uuid) === ${data}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllStudies(queryParams: GetAllStudiesDto) {
    this.logger.log('StudiesService studies.findMany');
    const undOrArrData = (data: string) => (data ? data.split(',') : undefined);
    const include = {
      patients: true,
      modality_study: {
        include: {
          modalities: true,
        },
      },
      conclusion: true,
    };
    const where = {
      access_number: queryParams.accesion,

      status: { in: undOrArrData(queryParams.status) },

      description: { in: undOrArrData(queryParams.description) },

      patients: {
        iin: { startsWith: queryParams.MRN },
        fullname: { startsWith: queryParams.patient_name },
      },

      modality_study: queryParams.modality
        ? {
            some: {
              modalities: {
                name: { in: undOrArrData(queryParams.modality) },
              },
            },
          }
        : undefined,
    };

    const [count, data] = await this.prismaService.$transaction([
      this.prismaService.studies.count({ where }),
      this.prismaService.studies.findMany({
        skip: queryParams.skip || 0,
        take: queryParams.take || 20,
        orderBy: {
          updated_at: queryParams.orderBy ? 'asc' : 'desc',
        },
        where,
        include,
      }),
    ]);
    return { count, data };
  }
  async createSupabaseStudies() {
    const data = {
      studies: {
        ohif_id: 'string',
        description: 'string',
        access_number: 'string',
        date: 's',
      },
      patient: {
        iin: '010525550491',
        phone: '87471873000',
        email: 'nurzatsj@gmail.com',
      },
      organizations: {
        institution_name: 'string',
      },
      modalities: [
        {
          name: 'string',
        },
      ],
    };
    let supabaseStudies = await this.supabaseService.studies.findFirst({
      where: { ohif_id: data.studies.ohif_id },
    });
    if (supabaseStudies) {
      throw new HttpException(
        'len(supabaseStudies ohif_id) != 0',
        HttpStatus.BAD_REQUEST,
      );
    }
    const supabasePatient = await this.patientService.getOrCreate(data.patient);
    const supabaseOrganizations =
      await this.organizationsService.getOrCreateOrganizations(
        data.organizations,
      );

    supabaseStudies = await this.supabaseService.studies.create({
      data: {
        ohif_id: data.studies.ohif_id,
        patient_id: supabasePatient.id,
        date: data.studies.date,
        description: data.studies.description,
        access_number: data.studies.access_number,
        status: 'IN_PROGRESS',
        incorrectIIN: false,
        organization_id: supabaseOrganizations.id,
        uploaded_to_the_cloud: false,
      },
    });
    await this.modalitiesService.createModalitiesInStudy(
      data.modalities,
      Number(supabaseStudies.id),
    );
    return supabasePatient;
  }
}
