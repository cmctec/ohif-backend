import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Post } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { pipe, map, timeout, firstValueFrom } from 'rxjs';
import { RpnDataDto } from './dto/rpn.dto';
const convert = require('xml-js');

@Injectable()
export class RpnService {
  constructor(private readonly httpService: HttpService) {}
  private readonly logger = new Logger();
  async getRpnIin(iin: string): Promise<RpnDataDto> {
    try {
      this.logger.log('feth RPN ...');
      const rpn = await firstValueFrom(
        this.httpService
          .post(
            'http://test.smartecg.kz:53602/sync/http-wss/rpn',
            `<data><GetPersonByFIOIIN><iin>${iin}</iin><page>1</page><pageSize>1</pageSize></GetPersonByFIOIIN></data>`,
            {
              headers: { 'Content-Type': 'application/xml' },
            },
          )
          .pipe(
            timeout(10000),
            map((res: { data: string }) =>
              convert.xml2js(res.data, { compact: true }),
            ),
          ),
      );
      this.logger.log('feth RPN Success');
      return rpn.data.GetPersonByFIOIINResponse.array;
    } catch (e) {
      this.logger.error(`feth RPN Error:  ${e}`);
      return undefined;
    }
  }
}

//   const xmlData = convert.js2xml(
//     {
//       data: {
//         GetPersonByFIOIIN: {
//           iin: iin,
//           page: 1,
//           pageSize: 1,
//         },
//       },
//     },
//     {
//       compact: true,
//       ignoreComment: true,
//       spaces: 4,
//     },
//   );
//   const data = JSON.parse(xmlData);
