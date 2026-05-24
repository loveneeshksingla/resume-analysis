import "dotenv/config";

import mongoose from "mongoose";

import { analyzeResumeWithRAG } from "./modules/job-match/resume-rag.service.js";

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB Connected");

async function test() {
  const result = await analyzeResumeWithRAG({
    userId: "69eccb7483330a1946cf121c",

    resumeText: `
Senior Node.js backend engineer with Redis, MongoDB, and REST API experience.
`,

    jobDescription: `
Looking for backend engineer with microservices architecture,
Docker, Kubernetes, and scalable systems experience.
`,
  });

  console.log(result);
}

test();