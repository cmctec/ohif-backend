import { Module } from '@nestjs/common';
import { PrismaModule } from '../utilModules/prisma/prisma.module';
import { PatientsController } from './patient.controller';
import { PatientService } from './patient.service';
import { RpnModule } from '../utilModules/rpn/rpn.module';
import { HttpModule } from '@nestjs/axios';
import { SupabaseModule } from '../utilModules/supabase/supabase.module';
import { MessengerApiModule } from '../utilModules/messengerApi/messengerApi.module';
import { UserModule } from 'src/user/user.module';
import { PdfJsReportApiModule } from 'src/utilModules/pdfJsReportApi/pdfJsReportApi.module';
import { S3Module } from 'src/utilModules/s3/s3.module';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    RpnModule,
    UserModule,
    PdfJsReportApiModule,
    HttpModule,
    MessengerApiModule,
    S3Module,
  ],
  controllers: [PatientsController],
  providers: [PatientService],
})
export class PatientModule {}
