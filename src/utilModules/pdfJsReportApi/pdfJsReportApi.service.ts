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
    c_image: string;
  }) {
    return await this.post({
      template: { name: 'mrconclusion' },
      options: { reports: { save: true } },
      data,
    });
  }

  // {
  //   conclusion_text: '<p>s</p>',
  //   brand_name: 'Green Clinic',
  //   research_date: '01.02.2023',
  //   doctor_fullname: '',
  //   c_image:
  //     'https://pkgrtavgertlzgsxrdhv.supabase.co/storage/v1/object/public/conclusionimage/1.3.46.670589.33.1.63797368001032204700001.5338110246164446048.png',
  //   service_name: 'Компьютерная томография',
  //   tell2: '+7 708 333 20 20, +7 (7172) 73 4759',
  //   patient_iin: '830608400064',
  //   patient_fullname: 'НУКАНОВА АЙЖАН ТОЛЕУБАЕВНА',
  // },
  async mrconclusion_image_null(data: {
    conclusion_text: string;
    brand_name: string;
    research_date: string;
    doctor_fullname: string;
    service_name: string;
    tell2: string;
    patient_iin: string;
    patient_fullname: string;
  }) {
    return await this.post({
      template: { name: 'mrconclusion_image_null' },
      options: { reports: { save: true } },
      data,
    });
  }
}

// {
//   conclusion_text: 'текст заключения',
//   brand_name: 'Green Clinic',
//   research_date: '30.01.2023',
//   doctor_fullname: 'Доктор',
//   service_name: 'Компьютерная томография',
//   tell2: '+7 708 333 20 20, +7 (7172) 73 4759',
//   patient_iin: '850803351234',
//   patient_fullname: 'АСКАРБЕКОВ САЯТ БОГДАТОВИЧ',
// }
