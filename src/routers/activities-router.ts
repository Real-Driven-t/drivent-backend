import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activitiesRouter = Router();

activitiesRouter.all("/*", authenticateToken).get("/", validateBody(getActivitiesSchema), getActivities);

export { activitiesRouter };
