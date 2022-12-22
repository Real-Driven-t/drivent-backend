import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, getDaysWithActivities } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activitiesRouter = Router();
//validateBody(getActivitiesSchema)

activitiesRouter.all("/*", authenticateToken)
  .get("/", validateBody(getActivitiesSchema), getActivities)
  .get("/days", getDaysWithActivities);

export { activitiesRouter };
