import activityRepository from "@/repositories/activity-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { cannotListActivitiesError, notFoundError } from "@/errors";
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

async function getActivities(userId: number, day: Date) {
  await verifyPermission(userId);

  const activities = await activityRepository.findActivitiesWithLocals(day);
  return activities;
}

async function getDays(userId: number) {
  await verifyPermission(userId);
  const days = await activityRepository.findDaysWithActivities();
  return days;
}

async function getDayActivities(userId: number, day: string) {
  await verifyPermission(userId);
  
  const substituteDay = day.replace("*", "/");
  const selectedDay = dayjs(substituteDay).add(21, "year").toISOString();
  if(!selectedDay) {
    throw cannotListActivitiesError();
  }
  const newDate = new Date(selectedDay);
  const activities = await activityRepository.findActivitiesWithLocals(newDate);
  return activities;
}

const activityService = {
  getActivities,
  getDays,
  getDayActivities,
};

export default activityService;
