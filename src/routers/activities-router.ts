import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, getActivitiesByDay, getDaysWithActivities, postActivity } from "@/controllers";
import { getActivitiesSchema, postActivitiesBookingSchema } from "@/schemas";

const activitiesRouter = Router();
//validateBody(getActivitiesSchema)

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", validateBody(getActivitiesSchema), getActivities)
  .get("/days", getDaysWithActivities)
  .get("/day/:day", getActivitiesByDay)
  .post("/", validateBody(postActivitiesBookingSchema), postActivity);

export { activitiesRouter };
