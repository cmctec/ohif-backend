import { Module } from '@nestjs/common';
import { PrismaModule } from '../utilModules/prisma/prisma.module';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';
import { RpnModule } from '../utilModules/rpn/rpn.module';
import { HttpModule } from '@nestjs/axios';
import { SupabaseModule } from '../utilModules/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule, RpnModule, HttpModule],
controllers: [PatientsController],
  providers: [PatientService],
})
export class PatientModule {}
