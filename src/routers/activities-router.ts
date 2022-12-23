import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, getActivitiesByDay, getDaysWithActivities, postActivity } from "@/controllers";
import { getActivitiesSchema, postActivitiesBookingSchema } from "@/schemas";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/:body", getActivities)
  .get("/days", getDaysWithActivities)
  .get("/day/:day", getActivitiesByDay)
  .post("/", validateBody(postActivitiesBookingSchema), postActivity);

export { activitiesRouter };
