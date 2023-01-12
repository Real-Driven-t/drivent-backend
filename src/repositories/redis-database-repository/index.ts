import { redis } from "@/config";
import { Event } from "@prisma/client";

type days = {
  day: Date;
};

async function getDays() {
  return redis.get("days");
}

async function insertDays(days: days[]) {
  return redis.setEx("days", 60 * 10, JSON.stringify(days));
}

async function getDaysActivities(newDate: Date) {
  return redis.get(newDate.toISOString());
}

async function insertDaysActivities(newDate: Date, activities: any[]) {
  return redis.setEx(newDate.toISOString(), 60 * 10, JSON.stringify(activities));
}

async function getEvent() {
  return redis.get("event");
}

async function insertEvent(event: Event) {
  return redis.setEx("event", 60 * 60 * 24, JSON.stringify(event));
}

const redisRepository = {
  getDays,
  insertDays,
  getDaysActivities,
  insertDaysActivities,
  getEvent,
  insertEvent,
};

export default redisRepository;
