import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { map, timeout, firstValueFrom } from 'rxjs';
import { MessengerApiDto } from './dto/messengerApiDto';
import { ReqMessengerApiDto } from './dto/reqMessengerApiDto';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessengerApiService {
  private readonly logger = new Logger();
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async post(reqData: ReqMessengerApiDto): Promise<MessengerApiDto> {
    try {
      this.logger.log('feth MessengerApi ...');
      return await firstValueFrom(
        this.httpService
          .put(
            `https://messenger-service.cmctech.pro/message/${uuidv4()}`,
            reqData,
            {
              auth: {
                username: this.configService.get<string>('MESSENGER_USERNAME'),
                password: this.configService.get<string>('MESSENGER_PASSWORD'),
              },
            },
          )
          .pipe(
            timeout(10000),
            map((res) => {
              this.logger.log('feth MessengerApi Success');
              return res.data;
            }),
          ),
      );
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

  async medreview_conclusion_ready_urldicomarchive(data: {
    phone: string;
    template_arguments: {
      name: string;
      groupShortName: string;
      url: string;
      //dicom
      url_anonym: string;
    };
  }) {
    return await this.post({
      template_name: 'medreview_conclusion_ready_urldicomarchive',
      translite: false,
      source: 'MEDISCAN',
      type: 'WHATSAPP',
      ...data,
    });
  }
}
