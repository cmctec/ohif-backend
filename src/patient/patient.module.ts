import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';
import { RpnModule } from '../rpn/rpn.module';

@Module({
  imports: [PrismaModule, SupabaseModule, RpnModule],
controllers: [PatientsController],
  providers: [PatientService],
})
export class PatientModule {}
