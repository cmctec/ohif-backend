import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { map, timeout, firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

type maglitProps = {
  slug: string;
  password: string;
  link: string;
};

@Injectable()
export class MaglitService {
  private readonly logger = new Logger();
  constructor(private readonly httpService: HttpService) {}

  async available(props: { slug: string }) {
    try {
      this.logger.log('feth MaglitApi  available ...');
      return await firstValueFrom(
        this.httpService.put('https://sl.eyelab.kz/api/available', props).pipe(
          timeout(10000),
          map((res) => {
            this.logger.log('feth MaglitApi available Success');
            return res.data;
          }),
        ),
      );
    } catch (e) {
      this.logger.error(`feth MaglitApi Error:  ${e}`);
      return undefined;
    }
  }
  async create(
    props: maglitProps,
  ): Promise<{ message: string; maglitLink: string }> {
    try {
      this.logger.log('feth MaglitApi create ...');
      return await firstValueFrom(
        this.httpService.put('https://sl.eyelab.kz/api/create', props).pipe(
          timeout(10000),
          map((res) => {
            this.logger.log('feth MaglitApi create Success');
            return res.data;
          }),
        ),
      );
    } catch (e) {
      this.logger.error(`feth MaglitApi Error:  ${e}`);
      return undefined;
    }
  }

  async createAndAvailable(
    link: string,
    slug?: string,
  ): Promise<{ message: string; maglitLink: string }> {
    this.logger.log(`func createAndAvailable start`);
    const data = { link, password: '', slug: slug || uuidv4() };
    await this.available({ slug: data.slug });
    const create = await this.create(data);
    this.logger.log(`func createAndAvailable finish`);
    return create;
  }
}
