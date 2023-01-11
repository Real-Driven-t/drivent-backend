import { connectRedis } from "@/config";

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
const redisRepository = {
  getDays,
  insertDays,
  getDaysActivities,
  insertDaysActivities,
};

export default redisRepository;
