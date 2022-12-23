import Joi from "joi";

export const getActivitiesSchema = Joi.object({
  day: Joi.date().required(),
});

export const postActivitiesBookingSchema = Joi.object({
  activityId: Joi.number().required(),
});
