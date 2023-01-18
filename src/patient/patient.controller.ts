import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { VerifyDto } from './dto/verify.dto';
import { PatientService } from './patient.service';
import { ParamsIsUUID } from '../config/dto/ParamUuidd';
// @AuthenticatedUser() user

@Controller('api/patient')
export class PatientsController {
  constructor(private readonly patientService: PatientService) {}
  
  @Get(':id')
  async getUserData(@Param() { id }: ParamsIsUUID) {
    return await this.patientService.patientData(id);
  }
  
  @Get()
  async getAllUserData() {
    return await this.patientService.getAllUserData();
  }
  
  @Post()
  async createUserData(@Body() register: VerifyDto) {
    console.log(register)
    return await this.patientService.getAllUserData();
  }
}
