import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { map, timeout, firstValueFrom } from 'rxjs';
import { MessengerApiDto } from './dto/messengerApiDto';
import { ReqMessengerApiDto } from './dto/reqMessengerApiDto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessengerApiService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger();

  async post(reqData: ReqMessengerApiDto): Promise<MessengerApiDto> {
    try {
      this.logger.log('feth MessengerApi ...');
      const rpn = await firstValueFrom(
        this.httpService
          .post(
            `https://messenger-service.cmctech.pro/message/${uuidv4()}`,
            reqData,
          )
          .pipe(
            timeout(10000),
            // map((res: { data: string }) =>
            //   convert.xml2js(res.data, { compact: true }),
            // ),
          ),
      );
      this.logger.log('feth MessengerApi Success');
      return rpn.data;
    } catch (e) {
      this.logger.error(`feth MessengerApi Error:  ${e}`);
      return undefined;
    }
  }

  async medreview_otpcode_dicom_archive(data: {
    phone: string;
    template_arguments: { otpcode: string };
  }) {
    return await this.post({
      template_name: 'medreview_otpcode_dicom_archive',
      translite: false,
      source: 'MEDISCAN',
      type: 'WHATSAPP',
      ...data,
    });
  }
}
