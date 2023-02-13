import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService],
  imports: [PrismaModule],
})
export class StudiesModule {}
