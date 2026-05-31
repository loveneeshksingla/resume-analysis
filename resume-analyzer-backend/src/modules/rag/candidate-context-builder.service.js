function buildChunkContext(chunk) {
  const metadata = [];

  if (chunk.section) {
    metadata.push(`Section: ${chunk.section}`);
  }

  if (chunk.company) {
    metadata.push(`Company: ${chunk.company}`);
  }

  if (chunk.role) {
    metadata.push(`Role: ${chunk.role}`);
  }

  if (chunk.project) {
    metadata.push(`Project: ${chunk.project}`);
  }

  if (chunk.duration) {
    metadata.push(`Duration: ${chunk.duration}`);
  }

  if (chunk.similarity) {
    metadata.push(
      `Relevance Score: ${(
        chunk.similarity * 100
      ).toFixed(2)}%`
    );
  }

  return `
${metadata.join("\n")}

Evidence:
${chunk.content}
`.trim();
}

export function buildCandidateContext(
  rankedCandidates
) {
  const candidatesForAI =
    rankedCandidates.slice(0, 10);

  return candidatesForAI
    .map((candidate, index) => {
      const chunkText = candidate.chunks
        .map((chunk) =>
          buildChunkContext(chunk)
        )
        .join(
          "\n\n-----------------------------\n\n"
        );

      return `
Candidate #${index + 1}

Name: ${candidate.candidateName}

Overall Match Score:
${(
        candidate.averageSimilarity * 100
      ).toFixed(2)}%

Top Match Score:
${(
        candidate.topMatchScore * 100
      ).toFixed(2)}%

Matched Sections:
${candidate.matchedSections?.join(", ") || "N/A"}

Resume Evidence:

${chunkText}
`;
    })
    .join(
      "\n\n============================================\n\n"
    );
}