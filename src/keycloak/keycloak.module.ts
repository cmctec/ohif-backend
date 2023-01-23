import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';
import * as env from 'dotenv';
import { CONFIGS } from '../config/env';
env.config();

//LINK_DOCS https://medium.com/devops-dudes/secure-nestjs-rest-api-with-keycloak-745ef32a2370
//LINK_DOCS https://www.npmjs.com/package/nest-keycloak-connect
@Module({
  imports: [KeycloakConnectModule.register(CONFIGS.KEYCLOAK)],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class KeycloakModule {}
