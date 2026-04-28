import { Redis } from "ioredis";

// Use the environment variable we added to docker-compose
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: null, // Required for BullMQ
});
