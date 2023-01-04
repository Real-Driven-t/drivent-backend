import Joi from "joi";

export const federatedCodeSchema = Joi.object({
  code: Joi.string().required(),
});
