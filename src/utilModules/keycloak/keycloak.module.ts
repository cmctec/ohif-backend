import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeycloakConfigService } from './keycloak-config.service';

//LINK_DOCS https://medium.com/devops-dudes/secure-nestjs-rest-api-with-keycloak-745ef32a2370
//LINK_DOCS https://www.npmjs.com/package/nest-keycloak-connect
@Module({
	imports: [ConfigModule],
	providers: [KeycloakConfigService],
	exports: [KeycloakConfigService],
})
export class AuthenticationModule {}