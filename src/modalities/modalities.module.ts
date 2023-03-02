import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { ModalitiesController } from './modalities.controller';
import { ModalitiesService } from './modalities.service';
import { SupabaseModule } from 'src/utilModules/supabase/supabase.module';

@Module({
  controllers: [ModalitiesController],
  providers: [ModalitiesService],
  imports: [PrismaModule, SupabaseModule],
  exports: [ModalitiesService],
})
export class ModalitiesModule {}
