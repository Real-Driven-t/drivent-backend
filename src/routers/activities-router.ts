import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, getActivitiesByDay, getDaysWithActivities } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activitiesRouter = Router();
//validateBody(getActivitiesSchema)

activitiesRouter.all("/*", authenticateToken)
  .get("/", validateBody(getActivitiesSchema), getActivities)
  .get("/days", getDaysWithActivities)
  .get("/day/:day", getActivitiesByDay);

export { activitiesRouter };
