import { Module } from '@nestjs/common';
import { RecaptchaService } from './recaptcha.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [RecaptchaService],
  imports: [HttpModule],
})

export class RecaptchaModule {}
