import * as Joi from 'joi';

export const schema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  MAIL_HOST: Joi.string(),
  MAIL_PORT: Joi.number(),
  MAIL_USER: Joi.string(),
  MAIL_PASSWORD: Joi.string(),
});
