import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { S3Module } from 'src/utilModules/s3/s3.module';
import { ConclusionController } from './conclusion.controller';
import { ConclusionService } from './conclusion.service';

@Module({
  controllers: [ConclusionController],
  providers: [ConclusionService],
  imports: [PrismaModule, S3Module],
})
export class ConclusionModule {}
