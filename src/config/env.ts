import * as env from 'dotenv';
env.config();

export const CONFIGS = {
  APP: {
    PORT: process.env.APP_PORT
  },
  KEYCLOAK: {
   authServerUrl: process.env.AUTH_SERVER_URL,
   realm: process.env.REALM,
   clientId: process.env.CLIENT_ID,
   secret: process.env.SECRET,
  }
} as const

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});