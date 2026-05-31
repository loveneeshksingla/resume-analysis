import { createEmbedding } from "../../shared/ai/embedding.service.js";
import { cosineSimilarity } from "../../shared/utils/cosineSimilarity.js";

const SECTION_WEIGHTS = {
  SKILLS: 1.5,
  EXPERIENCE: 1.4,
  PROJECTS: 1.3,
  SUMMARY: 1.1,
  CERTIFICATIONS: 0.8,
  EDUCATION: 0.7,
  GENERAL: 0.5,
};

const STOP_WORDS = new Set([
  "with",
  "and",
  "or",
  "for",
  "the",
  "a",
  "an",
  "having",
  "experience",
  "experienced",
  "in",
  "of",
  "to",
  "on",
  "at",
  "from",
  "by",
  "using",
]);

function calculateKeywordBoost(query, chunk) {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(
      (word) =>
        word.length > 2 &&
        !STOP_WORDS.has(word)
    );

  const searchableText = `
    ${chunk.content}
    ${chunk.company || ""}
    ${chunk.role || ""}
    ${chunk.project || ""}
    ${chunk.duration || ""}
  `.toLowerCase();

  let matches = 0;

  for (const word of queryWords) {
    if (searchableText.includes(word)) {
      matches++;
    }
  }

  return matches * 0.03;
}

function calculateFinalScore({
  semanticScore,
  keywordBoost,
  section,
}) {
  const sectionWeight = SECTION_WEIGHTS[section] || 1;

  return (
    semanticScore * sectionWeight +
    keywordBoost
  );
}

export async function retrieveRelevantChunks({
  query,
  embeddedChunks,
  topK = 30,
}) {
  const queryEmbedding = await createEmbedding(query);

  const scoredChunks = embeddedChunks.map(
    (chunk) => {
      const semanticScore =
        cosineSimilarity(
          queryEmbedding,
          chunk.embedding
        );

      const keywordBoost =
        calculateKeywordBoost(
          query,
          chunk
        );

      const similarity =
        calculateFinalScore({
          semanticScore,
          keywordBoost,
          section: chunk.section,
        });

      return {
        ...chunk,
        semanticScore,
        keywordBoost,
        similarity,
      };
    }
  );

  scoredChunks.sort(
    (a, b) => b.similarity - a.similarity
  );

  const uniqueChunks = [];
  const seen = new Set();

  for (const chunk of scoredChunks) {
    const dedupeKey = `${chunk.candidateId}-${chunk.content}`;

    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    uniqueChunks.push(chunk);

    if (uniqueChunks.length >= topK) {
      break;
    }
  }

  return uniqueChunks;
}