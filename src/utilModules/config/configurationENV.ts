import * as Joi from 'joi';
const notNullRequiredStr= Joi.string().allow(null, '').required()
export default {
 validationSchema: Joi.object({
   PORT: Joi.number().default(8888),
   POSTGRES_DB:notNullRequiredStr,
   POSTGRES_USER: notNullRequiredStr,
   POSTGRES_PASSWORD: notNullRequiredStr,
   POSTGRES_HOST: notNullRequiredStr,
   DATABASE_PORT: notNullRequiredStr,
   DATABASE_URL: notNullRequiredStr,
   SUPABASE_DB_URL: notNullRequiredStr,
   PGADMIN_DEFAULT_EMAIL: notNullRequiredStr,
   PGADMIN_DEFAULT_PASSWORD: notNullRequiredStr,
   RECAPTCHA_SECRET: notNullRequiredStr,
   REALM: notNullRequiredStr,
   CLIENT_ID: notNullRequiredStr,
   SECRET: notNullRequiredStr,
   AUTH_SERVER_URL: notNullRequiredStr,
 }),
}