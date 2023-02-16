import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfJsReportApiService } from './pdfJsReportApi.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PdfJsReportApiService],
  exports: [PdfJsReportApiService],
})
export class PdfJsReportApiModule {}
