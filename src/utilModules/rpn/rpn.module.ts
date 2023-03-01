import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RpnService } from './rpn.service';
import { lodashModule } from '../lodash/lodash.module';

@Module({
  imports: [HttpModule, lodashModule],
  providers: [RpnService],
  exports: [RpnService],
})
export class RpnModule {}
