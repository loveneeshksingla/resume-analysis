import { Queue } from "bullmq";
import { redisConnection } from "../../shared/queue/redis.connection.js";


export const resumeQueue = new Queue("resume-analysis", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3, // retry
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});