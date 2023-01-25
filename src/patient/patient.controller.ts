import {
  Body,
  Controller,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { PatientService } from './patient.service';
import { SavePatientDto } from './dto/savePatient.dto';
import { RecaptchaGuard } from '../utilModules/recaptcha/recaptcha.guard';
// @AuthenticatedUser() user

@Controller('v1/patient')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}
  
  @Public()
  @Put('/save')
  @UseGuards(RecaptchaGuard)
  // https://stackoverflow.com/questions/65687512/nestjs-and-google-recaptcha
  // https://www.google.com/recaptcha/about/
  async savePatient(@Body() data: SavePatientDto) {
    return await this.patientService.savePatientSupabase(data);
  }
  @Put('/send/otp')
  async sendOptCode() {
    return '';
    // return await this.patientService.savePatientSupabase();
  }
}
// 6LfitRgkAAAAAACVPq9bdv1MIAE3KiJvnFf2FM4s

// <script src="https://www.google.com/recaptcha/enterprise.js?render=6LfitRgkAAAAAACVPq9bdv1MIAE3KiJvnFf2FM4s"></script>
// <script>
// grecaptcha.enterprise.ready(function() {
//     grecaptcha.enterprise.execute('6LfitRgkAAAAAACVPq9bdv1MIAE3KiJvnFf2FM4s', {action: 'login'}).then(function(token) {
//        ...
//     });
// });
// </script>
