import 'dotenv/config';
import { Worker } from "bullmq";
import { redisConnection } from "../shared/queue/redis.connection.js";
import { processResumeAnalysis } from "../modules/resume/resume.service.js";
import { checkIdempotency } from "../shared/idempotency/idempotency.service.js";
import connectDB from '../config/db.js';

await connectDB();

new Worker(
    "resume-analysis", // must match queue name
    async (job) => {
        console.log(`[Worker] Received job ${job.id}`);
        const { resumeId, userId, resumeText, idempotencyRecordId } = job.data;
        console.log(`[Worker] Processing job ${job.id}`);
        await processResumeAnalysis({ resumeId, userId, resumeText, idempotencyRecordId });
        console.log(`[Worker] Completed job ${job.id}`);
    },
    {
        connection: redisConnection,
        concurrency: 2,
    }
);