import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
  AuthGuard,
} from 'nest-keycloak-connect';

//LINK_DOCS https://medium.com/devops-dudes/secure-nestjs-rest-api-with-keycloak-745ef32a2370
//LINK_DOCS https://www.npmjs.com/package/nest-keycloak-connect
const KeycloakConnectConfig = {
  authServerUrl: 'http://localhost:89/auth',
  realm: 'ohif',
  clientId: 'ohif-api',
  secret: 'qsb7RPiPN2ULjlc0jQBJvMAn1x162JDX',
};

@Module({
  imports: [KeycloakConnectModule.register(KeycloakConnectConfig)],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class KeycloakModule {}
