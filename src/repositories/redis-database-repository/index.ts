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

const redisRepository = {
  getDays,
  insertDays,
};

export default redisRepository;
