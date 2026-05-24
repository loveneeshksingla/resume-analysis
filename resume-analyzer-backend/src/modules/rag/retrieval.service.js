import { createEmbedding } from "../../shared/ai/embedding.service.js";
import { cosineSimilarity } from "../../shared/utils/cosineSimilarity.js";

export async function retrieveRelevantChunks({
  query,
  embeddedChunks,
  topK = 3,
}) {
  // Generate embedding for recruiter query
  const queryEmbedding = await createEmbedding(query);

  // Calculate similarity
  const scoredChunks = embeddedChunks.map(chunk => ({
    ...chunk,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort by highest similarity
  scoredChunks.sort((a, b) => b.similarity - a.similarity);

  // Return top relevant chunks
  return scoredChunks.slice(0, topK);
}