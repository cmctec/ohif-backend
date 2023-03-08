import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PdfJsReportApiService } from './pdfJsReportApi.service';
@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [PdfJsReportApiService],
  exports: [PdfJsReportApiService],
})
export class PdfJsReportApiModule {}
