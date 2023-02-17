import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { GetAllStudiesDto } from './dto/getAllStudies.dto';

@Injectable()
export class StudiesService {
  constructor(private readonly prismaService: PrismaService) {}
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
}
