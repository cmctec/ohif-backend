import { Global, Module } from '@nestjs/common';
import { LodashService } from './lodash.service';
@Global()
@Module({
  imports: [],
  providers: [LodashService],
  exports: [LodashService],
})
export class lodashModule {}
