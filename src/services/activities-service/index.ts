import activityRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import redisRepository from "@/repositories/redis-database-repository";
import { cannotListActivitiesError, notFoundError, conflictError } from "@/errors";
import dayjs from "dayjs";

async function verifyPermission(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote) {
    throw cannotListActivitiesError();
  }
}

async function getDays(userId: number) {
  await verifyPermission(userId);
  const daysCache = await redisRepository.getDays();
  if (!daysCache) {
    const days = await activityRepository.findDaysWithActivities();
    await redisRepository.insertDays(days);
    return days;
  }
  return JSON.parse(daysCache);
}

async function getDayActivities(userId: number, day: string) {
  await verifyPermission(userId);

  const substituteDay = day.replace("*", "/");
  const selectedDay = dayjs(substituteDay).add(21, "year").toISOString();
  if (!selectedDay) {
    throw cannotListActivitiesError();
  }
  const newDate = new Date(selectedDay);
  const activitiesCache = await redisRepository.getDaysActivities(newDate);
  if (!activitiesCache) {
    const activities = await activityRepository.findActivitiesWithLocals(newDate);
    await redisRepository.insertDaysActivities(newDate, activities);
    return activities;
  }

  return activitiesCache;
}

async function postActivity(userId: number, activityId: number) {
  await verifyPermission(userId);
  const activity = await activityRepository.getActivityById(activityId);
  if (!activity) throw notFoundError();
  const myActivities = await activityRepository.getAllActivitiesFromUser(userId);

  myActivities.forEach((e) => {
    const isTheSameDay = e.Activity.day.toISOString() === activity.day.toISOString();
    const isThSameHorary = e.Activity.start.toISOString() === activity.start.toISOString();

    if (isTheSameDay && isThSameHorary) {
      throw conflictError("ActivitySchedulesConflict");
    }
  });

  return activityRepository.createActivity(userId, activityId);
}

async function getUserActivities(userId: number) {
  await verifyPermission(userId);

  const myActivitiesBookings = await activityRepository.getUserBookings(userId);

  const bookingsIds = myActivitiesBookings.map((e) => {
    return e.activityId;
  });

  return bookingsIds;
}

const activityService = {
  getDays,
  getUserActivities,
  getDayActivities,
  postActivity,
};

export default activityService;
