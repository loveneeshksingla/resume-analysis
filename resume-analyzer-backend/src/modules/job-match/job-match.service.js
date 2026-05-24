import cosineSimilarity from "compute-cosine-similarity";

import { createEmbedding } from "../../shared/ai/embedding.service.js";

export async function matchResumeToJob({
  resumeText,
  jobDescription,
}) {
  // Generate embeddings
  const resumeEmbedding = await createEmbedding(resumeText);

  const jobEmbedding = await createEmbedding(jobDescription);

  // Compare semantic meaning
  const similarity = cosineSimilarity(
    resumeEmbedding,
    jobEmbedding
  );

  return {
    similarityScore: Number((similarity * 100).toFixed(2)),
  };
}