import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaglitService } from './maglit.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MaglitService],
  exports: [MaglitService],
})
export class MaglitModule {}
