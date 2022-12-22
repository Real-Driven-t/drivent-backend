import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities, postActivitie } from "@/controllers";
import { getActivitiesSchema, postActivitySchema } from "@/schemas";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", validateBody(getActivitiesSchema), getActivities)
  .post("/", validateBody(postActivitySchema), postActivitie);

export { activitiesRouter };
