import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [PrismaModule],
controllers: [PatientsController],
  providers: [PatientService],
})
export class PatientModule {}
