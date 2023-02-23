import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { map, timeout, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ReqPdfJsReportApi } from './dto/reqReqPdfJsReportApiDto';

@Injectable()
export class PdfJsReportApiService {
  private readonly logger = new Logger();

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async post(reqData: ReqPdfJsReportApi): Promise<Buffer> {
    try {
      this.logger.log('start PdfJsReportApiService ...');
      return await firstValueFrom(
        this.httpService
          .post(`http://94.247.134.157:5488/api/report`, reqData, {
            responseType: 'arraybuffer',
            auth: {
              username: this.configService.get<string>('PDF_JSREPORT_USERNAME'),
              password: this.configService.get<string>('PDF_JSREPORT_PASSWORD'),
            },
          })
          .pipe(
            timeout(10000),
            map((res) => {
              this.logger.log('PdfJsReportApiService Success');
              return res.data;
            }),
          ),
      );
    } catch (e) {
      this.logger.error(`PdfJsReportApiService Error:  ${e}`);
      return undefined;
    }
  }

  async mrconclusion(data: {
    conclusion_text: string;
    brand_name: string;
    research_date: string;
    doctor_fullname: string;
    service_name: string;
    tell2: string;
    patient_iin: string;
    patient_fullname: string;
    c_image?: string;
  }) {
    return await this.post({
      template: { name: 'mrconclusion_test_print' },
      options: { reports: { save: true } },
      data,
    });
  }
}
