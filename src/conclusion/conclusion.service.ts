import { Injectable, Logger } from '@nestjs/common';
import { userPrismaType } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { MessengerApiService } from 'src/utilModules/messengerApi/messengerApi.service';
import { PdfJsReportApiService } from 'src/utilModules/pdfJsReportApi/pdfJsReportApi.service';
import { PrismaService } from 'src/utilModules/prisma/prisma.service';
import { S3Service } from 'src/utilModules/s3/s3.service';
import { CreateNewConclusion } from './dto/createNewConclusion.dto';
import { conclusionPrismaType } from './dto/prismatypes';
import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { MaglitService } from 'src/utilModules/maglit/maglit.service';
import { format } from 'date-fns';
import { SupabaseService } from 'src/utilModules/supabase/supabase.service';

@Injectable()
export class ConclusionService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly prismaService: PrismaService,
    private readonly pdfJsReportApiService: PdfJsReportApiService,
    private readonly userService: UserService,
    private readonly messengerApiService: MessengerApiService,
    private readonly maglitService: MaglitService,
    private readonly supabaseService: SupabaseService,
  ) {}
  private readonly logger = new Logger();

  async createNewConclusion(
    data: CreateNewConclusion,
    files: Array<Express.Multer.File>,
    user_name: string, // is doctor uuid
  ) {
    // может study_id быть не совпадёт
    //TODO doctor_iin error if null in update
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

        tell2: '+7 708 333 20 20, +7 (7172) 73 4759',

        conclusion_text: data.conclusion_text,
        doctor_fullname: data.doctor_fullname,
        patient_fullname: data.studies.patients.fullname,
        patient_iin: data.studies.patients.iin,
        research_date: format(data.created_at, 'mm/dd/yyyy'),
        c_image: data.conclusion_image[0]?.image_url,
      };
      this.logger.log('feth pdfJsReportApiService.mrconclusion ...');
      const PDF: Buffer = await this.pdfJsReportApiService.mrconclusion(
        PDFData,
      );
      this.logger.log('final pdfJsReportApiService.mrconclusion');

      this.logger.log('feth pdfs3Service.uploadPublicFile s3 ...');
      const s4DataTest = await this.s3Service.uploadPublicFile(
        PDF,
        'application/pdf',
        'conclusion_pdf',
      );
      this.logger.log('final pdfs3Service.uploadPublicFile');

      this.logger.log('feth conclusion.update ...');
      await this.prismaService.conclusion.update({
        where: { id: data.id },
        data: { conclusion_url: s4DataTest.Location },
        include: { conclusion_image: true },
      });
      this.logger.log('final conclusion.update ');

      const conclusionUrlMaglit = await this.maglitService.createAndAvailable(
        s4DataTest.Location,
      );

      this.logger.log('feth share_dicom_archive.create ...');
      const token = createHash('sha256').update(uuidv4()).digest('base64');
      await this.prismaService.share_dicom_archive.create({
        data: { token, study_id: data.study_id },
      });
      this.logger.log('final share_dicom_archive.create');

      const shareDicomArchiveMaglit =
        await this.maglitService.createAndAvailable(
          `https://mr.eyelab.kz/archive-request/${token}`,
        );

      if (!!data.studies.patients.phone) {
        const mesegeBody = {
          phone: data.studies.patients.phone,
          template_arguments: {
            groupShortName: PDFData.brand_name,
            name: PDFData.patient_fullname,
            url: `https://sl.eyelab.kz/${shareDicomArchiveMaglit.maglitLink} `,
            url_anonym: `https://sl.eyelab.kz/${conclusionUrlMaglit.maglitLink} `,
          },
        };
        const mesegeData =
          await this.messengerApiService.medreview_conclusion_ready_urldicomarchive(
            mesegeBody,
          );
        await this.prismaService.studies.update({
          where: { id: data.study_id },
          data: {
            sms_status: mesegeData.status,
            uuid_whatsapp: mesegeData.id,
          },
        });
      } else {
        await this.prismaService.studies.update({
          where: { id: data.study_id },
          data: {
            sms_status: 'PhonеNotFound',
          },
        });
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
  async supabaseGetPDFURL(id: number) {
    //when i do
    //pdf in public s3
    return this.supabaseService.conclusion.findFirst({
      where: { id },
      select: {
        conclusion_url: true,
      },
    });
  }
}
