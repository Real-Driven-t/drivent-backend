import Joi from "joi";

export const getActivitiesSchema = Joi.object({
  day: Joi.date().required(),
});
