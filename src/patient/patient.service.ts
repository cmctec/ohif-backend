import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatientService {
  constructor(private readonly prismaService: PrismaService) {}

  async patientData(id: string) {
    return await this.prismaService.patients.findUnique({ where: { id } });
  }
  
  async getAllUserData() {
   return await this.prismaService.patients.findMany();
 }
  
}
