import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';
import { RecaptchaModule } from './utilModules/recaptcha/recaptcha.module';
import configuration from './utilModules/config/configurationENV';
import { KeycloakConfigService } from './utilModules/keycloak/keycloak-config.service';
import { AuthenticationModule } from './utilModules/keycloak/keycloak.module';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { StudiesModule } from './studies/studies.module';
import { ModalitiesModule } from './modalities/modalities.module';
import { ConclusionModule } from './conclusion/conclusion.module';

@Module({
  imports: [
    //env config
    ConfigModule.forRoot(configuration),
    //KeycloakConnect config
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [AuthenticationModule],
    }),
    // more modules
    PatientModule,
    RecaptchaModule,
    StudiesModule,
    ModalitiesModule,
    ConclusionModule,
  ],
  controllers: [],
  providers: [
    //KeycloakConnect guards
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
