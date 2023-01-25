import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import configuration from './config/env';
import { KeycloakConfigService } from './keycloak/keycloak-config.service';
import { AuthenticationModule } from './keycloak/keycloak.module';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';

@Module({
  imports: [
    ConfigModule.forRoot({
      //is true ==> ignore .env file
      ignoreEnvFile: false,
      isGlobal: true,
      load: [configuration],
    }),

    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [AuthenticationModule],
    }),
    PatientModule,
    RecaptchaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
