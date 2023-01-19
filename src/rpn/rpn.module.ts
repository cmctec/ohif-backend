import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RpnService } from './rpn.service';

@Module({
  imports: [HttpModule],
  providers: [RpnService],
  exports: [RpnService],
})
export class RpnModule {}
