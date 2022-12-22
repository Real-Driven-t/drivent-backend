import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { body } = req.params;
  const day = new Date(body);

  const isValidDate = Date.parse(body);

  if (isNaN(isValidDate)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const activities = await activityService.getActivities(Number(userId), day);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
