import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getActivities, getActivitiesByDay, getDaysWithActivities } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/days", getDaysWithActivities)
  .get("/day/:day", getActivitiesByDay);

export { activitiesRouter };
