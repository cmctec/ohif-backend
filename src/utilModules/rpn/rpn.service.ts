import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { map, timeout, firstValueFrom } from 'rxjs';
import { RpnDataDto } from './dto/rpn.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const convert = require('xml-js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { LodashService } from 'src/utilModules/lodash/lodash.service';

@Injectable()
export class RpnService {
  constructor(
    private readonly itemService: LodashService,
    private readonly httpService: HttpService,
  ) {}
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
            timeout(5000),
            map((res: { data: string }) =>
              convert.xml2js(res.data, { compact: true }),
            ),
          ),
      );
      this.logger.log('feth RPN Success');
      return rpn.data?.GetPersonByFIOIINResponse?.array;
    } catch (e) {
      this.logger.error(`feth RPN Error:  ${e}`);
      return undefined;
    }
  }
  async getPatientData(iin: string) {
    const rpnData = await this.getRpnIin(iin);
    if (!!rpnData?.iin?._text) {
      const fullName = [
        rpnData?.lastName?._text,
        rpnData?.firstName?._text,
        rpnData?.secondName?._text,
      ].join(' ');
      return this.itemService.pickBy({
        iin: rpnData?.iin?._text,
        bdate: new Date(rpnData?.birthDate?._text),
        firstname: rpnData?.firstName?._text,
        //TODO
        gender: rpnData?.sex?._text,
        lastname: rpnData?.lastName?._text,
        surname: rpnData?.secondName?._text,
        fullname: fullName?.trim() && fullName,
      });
    } else {
      this.logger.warn(`RPN not exist ${iin}`);
      return;
    }
  }
}
