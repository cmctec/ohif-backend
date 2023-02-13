import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { ModalitiesController } from './modalities.controller';
import { ModalitiesService } from './modalities.service';

@Module({
  controllers: [ModalitiesController],
  providers: [ModalitiesService],
  imports: [PrismaModule],
})
export class ModalitiesModule {}
