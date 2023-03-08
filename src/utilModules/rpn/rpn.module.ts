import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { lodashModule } from '../lodash/lodash.module';
import { RpnService } from './rpn.service';
@Global()
@Module({
  imports: [lodashModule, ConfigModule],
  providers: [RpnService],
  exports: [RpnService],
})
export class RpnModule {}
