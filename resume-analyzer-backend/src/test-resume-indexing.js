import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import { indexResume } from "./modules/resume/resume-indexing.service.js";
import ResumeChunk from "./modules/resume/resume-chunk.model.js";

await mongoose.connect(process.env.MONGO_URI);

async function test() {
  try {
    console.log("MongoDB Connected");

    const sampleResume = `
SKILLS

Node.js
Redis
MongoDB
Docker

EXPERIENCE

Built scalable backend APIs for high traffic systems.

PROJECTS

Implemented Redis caching layer reducing response time by 60%.

EDUCATION

Bachelor of Technology in Computer Science.
`;

    const resumeId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const chunkCount = await indexResume({
      resumeId,
      userId,
      candidateName: "Rahul Sharma",
      resumeText: sampleResume,
    });

    console.log("\nIndexed Chunks:", chunkCount);

    const savedChunks = await ResumeChunk.find({
      resumeId,
    }).lean();

    console.log("\nSaved Chunks:\n");

    savedChunks.forEach((chunk, index) => {
      console.log(`Chunk ${index + 1}`);
      console.log(chunk.content);
      console.log(
        "Embedding Length:",
        chunk.embedding.length
      );
      console.log("-------------------------");
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

test();