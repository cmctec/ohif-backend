import { Injectable } from '@nestjs/common';
import { userPrismaType } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { PdfJsReportApiService } from 'src/utilModules/pdfJsReportApi/pdfJsReportApi.service';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { S3Service } from 'src/utilModules/s3/s3.service';
import { CreateNewConclusion } from './dto/createNewConclusion.dto';
import { conclusionPrismaType } from './dto/prismatypes';

@Injectable()
export class ConclusionService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
    private readonly pdfJsReportApiService: PdfJsReportApiService,
    private readonly userService: UserService,
  ) {}

  async createNewConclusion(
    data: CreateNewConclusion,
    files: Array<Express.Multer.File>,
    user_name: string,
  ) {
    // может study_id быть не совпадёт
    const user_data = await this.userService.getUserDataAndCheckOrganizations(
      user_name,
    );
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

    this.afterCreateNewConclusionGeneratePdfAndSave(
      updateConclusiondata,
      user_data,
    );
    return updateConclusiondata;
  }

  async afterCreateNewConclusionGeneratePdfAndSave(
    data: conclusionPrismaType,
    user_data: userPrismaType,
  ) {
    //это вне потока может работать если error сервер падает
    try {
      const PDFData = {
        brand_name: user_data.organization_user[0].organizations.name,
        service_name: 'Компьютерная томография',

        tell2: data.studies.patients.phone,

        conclusion_text: data.conclusion_text,
        doctor_fullname: data.doctor_fullname,
        patient_fullname: data.studies.patients.fullname,
        patient_iin: data.studies.patients.iin,
        research_date: String(data.created_at),
        c_image: data.conclusion_image[0]?.image_url,
      };
      const PDF: Buffer = data.conclusion_image[0]?.image_url
        ? await this.pdfJsReportApiService.mrconclusion(PDFData)
        : await this.pdfJsReportApiService.mrconclusion_image_null(PDFData);

      const s4DataTest = await this.s3Service.uploadPublicFile(
        PDF,
        'application/pdf',
        'conclusion_pdf',
      );

      await this.prismaService.conclusion.update({
        where: { id: data.id },
        data: { conclusion_url: s4DataTest.Location },
      });
    } catch (err) {
      console.error(err);
    }
  }
}
