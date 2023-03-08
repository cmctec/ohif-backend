import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessengerApiService } from './messengerApi.service';

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MessengerApiService],
  exports: [MessengerApiService],
})
export class MessengerApiModule {}
