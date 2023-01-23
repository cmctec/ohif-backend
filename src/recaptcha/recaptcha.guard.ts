import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  // constructor(private readonly httpService: HttpService) {}
  constructor(@Inject(HttpService) private httpService: HttpService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { body } = context.switchToHttp().getRequest();
    const { data }: any = await this.httpService
      .post(
        `https://www.google.com/recaptcha/api/siteverify?response=${body.recaptchaValue}&secret=${process.env.RECAPTCHA_SECRET}`,
      )
      .toPromise();
    if (!data.success) {
      throw new ForbiddenException({
        errorId: HttpStatus.FORBIDDEN,
        message: data['error-codes'],
      });
    }

    return true;
  }
}
// 6LdGQxwkAAAAAMdfaPhemcdjuC-lBeBvhrKHiW3C  HTML siteSecretKey
// 6LdGQxwkAAAAAI2Qku1qjb-AkjwYn_Pgcp_7PpuR secretKey
