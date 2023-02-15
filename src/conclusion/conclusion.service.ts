import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { S3Service } from 'src/utilModules/s3/s3.service';
import { CreateNewConclusion } from './dto/createNewConclusion.dto';

@Injectable()
export class ConclusionService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
  ) {}
  async createNewConclusion(
    data: CreateNewConclusion,
    files: Array<Express.Multer.File>,
  ) {
    const createObject = this.prismaService.conclusion.create({
      data: {
        study_id: data.study_id,
        conclusion_text: data.conclusion_text,
        // conclusion_image: data.conclusion_image,
        // conclusion_url: data.conclusion_image,
        doctor_fullname: data.doctor_fullname,
        doctor_iin: data.doctor_iin,
        ohif_id: data.ohif_id,
      },
    });

    const s3Data = await Promise.all(
      files.map((data) => {
        return this.s3Service.uploadPublicFile(data.buffer, data.mimetype);
      }),
    );
    console.log('s3Datas3Datas3Datas3Data===>', s3Data);

    return createObject;
  }
}
