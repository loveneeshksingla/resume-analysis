import dotenv from "dotenv";
dotenv.config();

import { chunkResume } from "./modules/rag/chunking.service.js";
import { embedChunks } from "./modules/rag/rag-embedding.service.js";
import { retrieveRelevantChunks } from "./modules/rag/retrieval.service.js";

import mongoose from "mongoose";

await mongoose.connect(process.env.MONGO_URI);

const resume = `
SKILLS

Node.js
Redis
MongoDB

EXPERIENCE

Built scalable backend APIs

PROJECTS

Created Redis caching system
`;

async function test() {

  const chunks = chunkResume(resume);
  const embeddedChunks = await embedChunks(chunks);

  const relevantChunks = await retrieveRelevantChunks({
    query: "Looking for backend engineer with Redis",
    embeddedChunks,
    topK: 2,
  });

  console.log("\nRELEVANT CHUNKS:");

  console.log(
    relevantChunks.map(chunk => ({
      content: chunk.content,
      similarity: chunk.similarity,
    }))
  );
}

test();