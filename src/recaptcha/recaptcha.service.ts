import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class RecaptchaService {
   constructor(private readonly httpService: HttpService) {}

   public validateCaptcha(context: ExecutionContext): Observable<boolean> {
    const { body } = context.switchToHttp().getRequest();
     return this.httpService.post(`https://www.google.com/recaptcha/api/siteverify?response=${body.recaptchaValue}&secret=${process.env.RECAPTCHA_SECRET}`).pipe(
       tap(resp => Logger.log(resp?.data, 'CaptchaService validate captcha')),
       map(resp => resp.data.success)
     );
   }
}
