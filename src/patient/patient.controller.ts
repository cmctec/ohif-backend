import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { VerifyDto } from './dto/verify.dto';
import { PatientService } from './patient.service';
import { ParamsIsUUID } from '../config/dto/ParamUuidd';
import { SavePatientDto } from './dto/savePatient.dto';
// @AuthenticatedUser() user

@Controller('v1/patient')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}
  @Put('/save')
  async savePatient(@Body() data: SavePatientDto) {
    console.log(data);
    return await this.patientService.savePatientSupabase(data);
  }
  @Put('/send/otp')
  async sendOptCode() {
    return '';
    // return await this.patientService.savePatientSupabase();
  }

  @Get()
  async getAllUserData() {
    console.log('asdasdasd');
    const data = await this.patientService.getAllPatientSupabase();
    return data;
  }
  @Get(':id')
  async getUserData(@Param() { id }: ParamsIsUUID) {
    return await this.patientService.patientData(id);
  }

  @Post()
  async createUserData(@Body() register: VerifyDto) {
    console.log(register);
    return await this.patientService.getAllUserData();
  }
}
