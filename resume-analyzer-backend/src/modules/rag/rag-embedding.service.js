import { createEmbedding } from "../../shared/ai/embedding.service.js";

export async function embedChunks(chunks) {
  const embeddedChunks = [];

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk.content);

    embeddedChunks.push({
      ...chunk,
      embedding,
    });
  }

  return embeddedChunks;
}