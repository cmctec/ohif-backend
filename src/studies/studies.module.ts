import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/utilModules/prisma/prisma.module';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { PatientModule } from 'src/patient/patient.module';
import { SupabaseModule } from 'src/utilModules/supabase/supabase.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ModalitiesModule } from 'src/modalities/modalities.module';
import { lodashModule } from 'src/utilModules/lodash/lodash.module';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService],
  imports: [
    PrismaModule,
    SupabaseModule,
    PatientModule,
    OrganizationsModule,
    ModalitiesModule,
    lodashModule,
  ],
})
export class StudiesModule {}
