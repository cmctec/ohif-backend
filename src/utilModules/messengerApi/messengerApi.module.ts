import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessengerApiService } from './messengerApi.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MessengerApiService],
  exports: [MessengerApiService],
})
export class MessengerApiModule {}
