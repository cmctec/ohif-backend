import { PrismaModule } from '../utilModules/prisma/prisma.module';
import { SupabaseModule } from '../utilModules/supabase/supabase.module';
import { RpnModule } from '../utilModules/rpn/rpn.module';
import { UserModule } from '../user/user.module';
import { PdfJsReportApiModule } from '../utilModules/pdfJsReportApi/pdfJsReportApi.module';
import { MessengerApiModule } from '../utilModules/messengerApi/messengerApi.module';
import { S3Module } from '../utilModules/s3/s3.module';
import { lodashModule } from '../utilModules/lodash/lodash.module';
import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';

describe('TweetsService', () => {
  let service: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientService],
      imports: [
        PrismaModule,
        SupabaseModule,
        RpnModule,
        UserModule,
        PdfJsReportApiModule,
        MessengerApiModule,
        S3Module,
        lodashModule,
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
