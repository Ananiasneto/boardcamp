import joi from "joi";

export const customerSchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().min(8).max(9).required(),
  cpf: joi.string().length(11).regex(/^[0-9]+$/).required(),
});