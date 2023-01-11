import { createClient } from "redis";

export async function connectRedis() {
  try {
    const redisClient = createClient();
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.log(error);
  }
}
