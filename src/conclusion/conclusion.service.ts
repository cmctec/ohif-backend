import { Injectable } from '@nestjs/common';
import {
  appointment,
  conclusion,
  conclusion_image,
  patients,
  studies,
} from 'generated/prisma';
import { PdfJsReportApiService } from 'src/utilModules/pdfJsReportApi/pdfJsReportApi.service';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { S3Service } from 'src/utilModules/s3/s3.service';
import { CreateNewConclusion } from './dto/createNewConclusion.dto';

@Injectable()
export class ConclusionService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
    private readonly pdfJsReportApiService: PdfJsReportApiService,
  ) {}

  async createNewConclusion(
    data: CreateNewConclusion,
    files: Array<Express.Multer.File>,
  ) {
    // может study_id быть не совпадёт
    const createConclusiondata = await this.prismaService.conclusion.create({
      data: {
        study_id: data.study_id,
        conclusion_text: data.conclusion_text,
        doctor_fullname: data.doctor_fullname,
        doctor_iin: data.doctor_iin,
        ohif_id: data.ohif_id,
      },
    });

    const s3Data = await Promise.all(
      files.map((data) => {
        return this.s3Service.uploadPublicFile(
          data.buffer,
          data.mimetype,
          'conclusion_image',
        );
      }),
    );

    const updateConclusiondata = await this.prismaService.conclusion.update({
      where: { id: createConclusiondata.id },
      data: {
        conclusion_image: {
          create: s3Data.map((s3DataItemData) => {
            return { image_url: s3DataItemData.Location };
          }),
        },
      },
      include: {
        conclusion_image: true,
        appointment: true,
        studies: { include: { patients: true } },
      },
    });

    this.afterCreateNewConclusionGeneratePdfAndSave(updateConclusiondata);
    return updateConclusiondata;
  }

  async afterCreateNewConclusionGeneratePdfAndSave(
    data: conclusion & {
      appointment: appointment[];
      studies: studies & {
        patients: patients;
      };
      conclusion_image: conclusion_image[];
    },
  ) {
    let PDF: Buffer;
    if (data.conclusion_image[0].image_url) {
      PDF = await this.pdfJsReportApiService.mrconclusion({
        brand_name: 'Green Clinic',
        service_name: 'Компьютерная томография',
        tell2: '874718730000',

        conclusion_text: data.conclusion_text,
        doctor_fullname: data.doctor_fullname,
        patient_fullname: data.studies.patients.fullname,
        patient_iin: data.studies.patients.iin,
        research_date: String(data.created_at),
        c_image: data.conclusion_image[0].image_url,
      });
    }
    const s4DataTest = await this.s3Service.uploadPublicFile(
      PDF,
      'application/pdf',
      //TO DO Name Floder
      'test_folder',
    );
    await this.prismaService.conclusion.update({
      where: { id: data.id },
      data: { conclusion_url: s4DataTest.Location },
    });
  }
}
