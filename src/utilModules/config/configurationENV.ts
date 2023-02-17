import * as Joi from 'joi';
const notNullRequiredStr = Joi.string().allow(null, '').required();
export default {
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(8888),

    RECAPTCHA_SECRET: notNullRequiredStr,
    RECAPTCHA_DISABLE: Joi.boolean().default('false'),

    POSTGRES_DB: notNullRequiredStr,
    POSTGRES_USER: notNullRequiredStr,
    POSTGRES_PASSWORD: notNullRequiredStr,
    POSTGRES_HOST: notNullRequiredStr,
    DATABASE_PORT: notNullRequiredStr,

    DATABASE_URL: notNullRequiredStr,

    SUPABASE_DB_URL: notNullRequiredStr,

    REALM: notNullRequiredStr,
    CLIENT_ID: notNullRequiredStr,
    SECRET: notNullRequiredStr,
    AUTH_SERVER_URL: notNullRequiredStr,

    MESSENGER_USERNAME: notNullRequiredStr,
    MESSENGER_PASSWORD: notNullRequiredStr,

    S3_ACCESS_KEY_ID: notNullRequiredStr,
    S3_SECRET_ACCESS_KEY: notNullRequiredStr,
    S3_REGION: notNullRequiredStr,
    S3_PUBLIC_BUCKET_NAME: notNullRequiredStr,
    ENDPOINT: notNullRequiredStr,
  }),
};
