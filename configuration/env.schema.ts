import Joi from "joi";

export const GATEWAY_PORT = "GATEWAY_PORT" as const;
export const AUTH_PORT = "AUTH_PORT" as const;
export const EVENT_PORT = "EVENT_PORT" as const;
export const MONGO_CONNECTION_STRING = "MONGO_CONNECTION_STRING" as const;
export const JWT_SECRET = "JWT_SECRET" as const;
export const BCRYPT_SALT_ROUNDS = "BCRYPT_SALT_ROUNDS" as const;

export interface Env {
  [GATEWAY_PORT]: number;
  [AUTH_PORT]: number;
  [EVENT_PORT]: number;
  [MONGO_CONNECTION_STRING]: string;
  [JWT_SECRET]: string;
  [BCRYPT_SALT_ROUNDS]: number;
}

export const validationSchema = Joi.object<Env>({
  [GATEWAY_PORT]: Joi.number().default(3000),
  [AUTH_PORT]: Joi.number().default(4000),
  [EVENT_PORT]: Joi.number().default(5000),
  [MONGO_CONNECTION_STRING]: Joi.string().required(),
  [JWT_SECRET]: Joi.string().required(),
  [BCRYPT_SALT_ROUNDS]: Joi.number().required(),
});
