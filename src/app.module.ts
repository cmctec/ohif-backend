import { Module } from '@nestjs/common';
import { KeycloakModule } from './keycloak/keycloak.module';
import { PatientModule } from './patient/patient.module';

@Module({
  imports: [KeycloakModule, PatientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
