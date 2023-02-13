import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';

@Injectable()
export class StudiesService {
  constructor(private readonly prismaService: PrismaService) {}
  private readonly logger = new Logger();

  async getStudies(id: string) {
    this.logger.log('StudiesService studies.findUnique');
    let data = await this.prismaService.studies.findUnique({
      where: { id },
      include: {
        patients: {},
        modality_study: {
          include: {
            modalities: {},
          },
        },
        conclusion: {},
      },
    });
    if (data) return data;
    if (!data) {
      throw new HttpException(`data(uuid) === ${data}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getAllStudies() {
    const  id = "" 
    this.logger.log('StudiesService studies.findUnique');
    let data = await this.prismaService.studies.findUnique({
      where: { id },
      include: {
        patients: {},
        modality_study: {
          include: {
            modalities: {},
          },
        },
        conclusion: {},
      },
    });
    if (data) return data;
    if (!data) {
      throw new HttpException(`data(uuid) === ${data}`, HttpStatus.BAD_REQUEST);
    }
  }
}
