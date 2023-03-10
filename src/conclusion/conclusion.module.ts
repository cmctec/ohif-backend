import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MaglitModule } from 'src/utilModules/maglit/maglit.module';
import { MessengerApiModule } from 'src/utilModules/messengerApi/messengerApi.module';
import { PdfJsReportApiModule } from 'src/utilModules/pdfJsReportApi/pdfJsReportApi.module';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { S3Module } from 'src/utilModules/s3/s3.module';
import { SupabaseModule } from 'src/utilModules/supabase/supabase.module';
import { ConclusionController } from './conclusion.controller';
import { ConclusionService } from './conclusion.service';

@Module({
  controllers: [ConclusionController],
  providers: [ConclusionService],
  imports: [
    MessengerApiModule,
    SupabaseModule,
    PrismaModule,
    UserModule,
    S3Module,
    HttpModule,
    PdfJsReportApiModule,
    MaglitModule,
  ],
})
export class ConclusionModule {}
