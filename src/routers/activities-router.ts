import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivitiesByDay, getDaysWithActivities, postActivity } from "@/controllers";
import { getActivitiesSchema, postActivitiesBookingSchema } from "@/schemas";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/days", getDaysWithActivities)
  .get("/day/:day", getActivitiesByDay)
  .post("/", validateBody(postActivitiesBookingSchema), postActivity);

export { activitiesRouter };
