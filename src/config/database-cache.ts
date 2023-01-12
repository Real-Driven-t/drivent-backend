import { createClient } from "redis";

let redis: any;
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
