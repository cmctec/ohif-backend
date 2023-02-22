import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { map, timeout, firstValueFrom } from 'rxjs';

type maglitProps = {
  slug: string;
  password: string;
  link: string;
};

@Injectable()
export class MaglitService {
  private readonly logger = new Logger();
  constructor(private readonly httpService: HttpService) {}
  async post(props: maglitProps): Promise<any> {
    try {
      this.logger.log('feth MaglitApi ...');
      return await firstValueFrom(
        this.httpService.put('https://sl.eyelab.kz/api/create', props).pipe(
          timeout(10000),
          map((res) => {
            this.logger.log('feth MaglitApi Success');
            return res.data;
          }),
        ),
      );
    } catch (e) {
      this.logger.error(`feth MaglitApi Error:  ${e}`);
      return undefined;
    }
  }
}
