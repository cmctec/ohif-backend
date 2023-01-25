import { Body, Controller, Put, UseGuards, Post } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { PatientService } from './patient.service';
import { SavePatientDto } from './dto/savePatient.dto';
import { RecaptchaGuard } from '../utilModules/recaptcha/recaptcha.guard';
import { SendOptCodeDto } from './dto/SendOptCodeDto';
import { OptCodeVerifyDto } from './dto/OptCodeVerifyDto';

@Controller('v1/patient')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}

  @Public()
  @Put('/save')
  @UseGuards(RecaptchaGuard)
  async savePatient(@Body() data: SavePatientDto) {
    // https://stackoverflow.com/questions/65687512/nestjs-and-google-recaptcha  https://www.google.com/recaptcha/about/
    return await this.patientService.savePatientSupabase(data);
  }

  @Public()
  @Post('/otp/send')
  @UseGuards(RecaptchaGuard)
  async optCodeSend(@Body() data: SendOptCodeDto) {
    return await this.patientService.patientSendOptCode(data);
  }

  @Public()
  @Post('/otp/verify')
  @UseGuards(RecaptchaGuard)
  async optCodeVerify(@Body() data: OptCodeVerifyDto) {
    return await this.patientService.optCodeVerify(data);
  }
}
