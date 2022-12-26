import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivitiesByDay, getDaysWithActivities, postActivity, getUserActivities } from "@/controllers";
import { postActivitiesBookingSchema } from "@/schemas";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/days", getDaysWithActivities)
  .get("/day/:day", getActivitiesByDay)
  .post("/", validateBody(postActivitiesBookingSchema), postActivity)
  .get("/booking", getUserActivities);

export { activitiesRouter };
