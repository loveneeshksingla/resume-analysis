import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import ResumeChunk from "./modules/resume/resume-chunk.model.js";

import { retrieveRelevantChunks } from "./modules/rag/retrieval.service.js";
import { rankCandidates } from "./modules/rag/candidate-ranking.service.js";
import { buildCandidateContext } from "./modules/rag/candidate-context-builder.service.js";
import { buildRagPrompt } from "./modules/rag/rag.prompt.js";

import { generateAIResponse } from "./shared/ai/ai.service.js";

await mongoose.connect(process.env.MONGO_URI);

async function test() {
  try {
    // Step 1: Load indexed resume chunks from MongoDB
    const chunks = await ResumeChunk.find().lean();

    if (!chunks.length) {
      console.log("No indexed resume chunks found.");
      process.exit(0);
    }

    // Normalize structure for retrieval service
    const indexedChunks = chunks.map((chunk) => ({
      candidateId: chunk.resumeId.toString(),
      candidateName: chunk.candidateName,
      content: chunk.content,
      embedding: chunk.embedding,
    }));

    console.log(`Loaded ${indexedChunks.length} chunks from MongoDB`);

    // Step 2: Recruiter search query
    const recruiterQuery =
      "Backend engineer with Redis and scalable systems experience";

    // Step 3: Retrieve relevant chunks
    const relevantChunks = await retrieveRelevantChunks({
      query: recruiterQuery,
      embeddedChunks: indexedChunks,
      topK: 10,
    });

    console.log("\nRELEVANT CHUNKS:\n");
    console.log(relevantChunks);

    // Step 4: Rank candidates
    const rankedCandidates = rankCandidates(relevantChunks);

    console.log("\nRANKED CANDIDATES:\n");
    console.log(rankedCandidates);

    // Step 5: Build candidate context
    const retrievedContext = buildCandidateContext(rankedCandidates);

    console.log("\nRETRIEVED CONTEXT:\n");
    console.log(retrievedContext);

    // Step 6: Build RAG prompt
    const messages = buildRagPrompt({
      recruiterQuery,
      retrievedContext,
    });

    const userId = "6a12db4194ace406b77f8bc2";

    // Step 7: Generate recruiter analysis
    const result = await generateAIResponse(
      {
        task: "RAG_RESUME_ANALYSIS",
        messages,
      },
      userId
    );

    console.log("\nAI ANALYSIS:\n");

    console.log(result.content);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

test();