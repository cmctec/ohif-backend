import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { ConclusionController } from './conclusion.controller';
import { ConclusionService } from './conclusion.service';

@Module({
  controllers: [ConclusionController],
  providers: [ConclusionService],
  imports: [PrismaModule],
})
export class ConclusionModule {}
