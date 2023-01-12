import { connectRedis } from "@/config";
import { Event } from "@prisma/client";

type days = {
  day: Date;
};

async function getDays() {
  const redis = await connectRedis();
  return redis.get("days");
}

async function insertDays(days: days[]) {
  const redis = await connectRedis();
  return redis.setEx("days", 60 * 10, JSON.stringify(days));
}

async function getDaysActivities(newDate: Date) {
  const redis = await connectRedis();
  return redis.get(newDate.toISOString());
}

async function insertDaysActivities(newDate: Date, activities: any[]) {
  const redis = await connectRedis();
  return redis.setEx(newDate.toISOString(), 60 * 10, JSON.stringify(activities));
}

async function getEvent() {
  const redis = await connectRedis();
  return redis.get("event");
}

async function insertEvent(event: Event) {
  const redis = await connectRedis();
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
