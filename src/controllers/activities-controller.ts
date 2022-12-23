import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { body } = req.params;
  const day = new Date(body);
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

export async function getDaysWithActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const activities = await activityService.getDays(userId);
    return res.status(200).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getActivitiesByDay(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { day } = req.params;
  try {
    const activities = await activityService.getDayActivities(userId, day);
    return res.status(200).send(activities);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    console.log(error);
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityId } = req.body;
  try {
    const { id } = await activityService.postActivity(userId, activityId);

    return res.status(httpStatus.CREATED).send({ activityBookingId: id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ConflictError") {
      return res.sendStatus(httpStatus.CONFLICT);
    }
    if (error.name === "cannotListActivitiesError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
