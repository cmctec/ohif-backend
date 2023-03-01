import { Module } from '@nestjs/common';
import { LodashService } from './lodash.service';

@Module({
  imports: [],
  providers: [LodashService],
  exports: [LodashService],
})
export class lodashModule {}
