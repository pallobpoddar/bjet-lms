import { createClient } from "redis";
import config from "../config";
import { logger } from "./logger";

const redisClient = createClient({
  password: config.redisPassword,
  socket: {
    host: config.redisHost,
    port: config.redisPort,
  },
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    logger.info("Connected to Redis");
  } catch (error) {
    logger.error("Failed to connect to Redis", error);
    throw error;
  }
};

export default redisClient;
