import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { SupabaseModule } from 'src/utilModules/supabase/supabase.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [PrismaModule, SupabaseModule],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
