import Joi from "joi";

const MONGO_CONNECTION_STRING = "MONGO_CONNECTION_STRING";

export interface Env {
  [MONGO_CONNECTION_STRING]: string;
}

export const validationSchema = Joi.object<Env>({
  [MONGO_CONNECTION_STRING]: Joi.string().required(),
});
