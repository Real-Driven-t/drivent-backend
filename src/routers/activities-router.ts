import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivities } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activitiesRouter = Router();
//validateBody(getActivitiesSchema)

activitiesRouter.all("/*", authenticateToken).get("/:body", getActivities);

export { activitiesRouter };
