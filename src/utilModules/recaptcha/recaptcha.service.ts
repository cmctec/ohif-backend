import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class RecaptchaService {
  constructor(private readonly httpService: HttpService) {}

  public validateCaptcha(context: ExecutionContext): Observable<boolean> {
    const { body } = context.switchToHttp().getRequest();
    return this.httpService
      .post(
        `https://www.google.com/recaptcha/api/siteverify?response=${body.recaptchaValue}&secret=${process.env.RECAPTCHA_SECRET}`,
      )
      .pipe(
        tap((resp) =>
          Logger.log(resp?.data, 'CaptchaService validate captcha'),
        ),
        map((resp) => resp.data.success),
      );
  }
}
