import { createClient, RedisClientType } from "redis";

let redis: RedisClientType;
connectRedis();
async function connectRedis() {
  try {
    redis = createClient();
    await redis.connect();
  } catch (error) {
    console.log(error);
  }
}

export { redis };
