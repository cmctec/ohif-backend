import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MessengerApiService } from './messengerApi.service';

@Module({
  imports: [HttpModule],
  providers: [MessengerApiService],
  exports: [MessengerApiService],
})
export class MessengerApiModule {}
