import { Module } from '@nestjs/common';
import { KeycloakModule } from './keycloak/keycloak.module';
import { PatientModule } from './patient/patient.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';

@Module({
  imports: [KeycloakModule, PatientModule, RecaptchaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
