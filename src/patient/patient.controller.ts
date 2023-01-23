import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthenticatedUser, Public } from 'nest-keycloak-connect';
import { VerifyDto } from './dto/verify.dto';
import { PatientService } from './patient.service';
import { ParamsIsUUID } from '../config/dto/ParamUuidd';
import { SavePatientDto } from './dto/savePatient.dto';
import { RecaptchaGuard } from '../recaptcha/recaptcha.guard';
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

  @Get()
  async getAllUserData() {
    const data = await this.patientService.getAllPatientSupabase();
    return data;
  }
  @Get(':id')
  async getUserData(@Param() { id }: ParamsIsUUID) {
    return await this.patientService.patientData(id);
  }

  @Post()
  async createUserData(@Body() register: VerifyDto) {
    return await this.patientService.getAllUserData();
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
