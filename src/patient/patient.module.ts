import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';
import { RpnModule } from '../rpn/rpn.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, SupabaseModule, RpnModule, HttpModule],
controllers: [PatientsController],
  providers: [PatientService],
})
export class PatientModule {}
