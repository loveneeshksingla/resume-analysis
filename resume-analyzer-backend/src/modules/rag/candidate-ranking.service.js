const SECTION_IMPORTANCE = {
  SKILLS: 1.5,
  EXPERIENCE: 1.4,
  PROJECTS: 1.3,
  SUMMARY: 1.1,
  CERTIFICATIONS: 0.8,
  EDUCATION: 0.7,
  GENERAL: 0.5,
};

function calculateDiversityBonus(chunks) {
  const sections = new Set(
    chunks.map((chunk) => chunk.section)
  );

  return sections.size * 0.03;
}

export function rankCandidates(retrievedChunks) {
  const candidates = {};

  for (const chunk of retrievedChunks) {
    if (!candidates[chunk.candidateId]) {
      candidates[chunk.candidateId] = {
        candidateId: chunk.candidateId,
        candidateName: chunk.candidateName,
        chunks: [],
        totalScore: 0,
      };
    }

    const weightedScore = chunk.similarity;

    candidates[chunk.candidateId].chunks.push({
      ...chunk,
      weightedScore,
    });

    candidates[chunk.candidateId].totalScore +=
      weightedScore;
  }

  return Object.values(candidates)
    .map((candidate) => {
      candidate.chunks.sort(
        (a, b) =>
          b.weightedScore - a.weightedScore
      );

      candidate.chunks = candidate.chunks.slice(0, 5);

      const averageScore =
        candidate.chunks.reduce(
          (sum, chunk) =>
            sum + chunk.weightedScore,
          0
        ) / candidate.chunks.length;

      const topChunkScore =
        candidate.chunks[0]?.weightedScore || 0;

      const diversityBonus =
        calculateDiversityBonus(
          candidate.chunks
        );

      const finalScore =
        averageScore * 0.7 +
        topChunkScore * 0.3 +
        diversityBonus;

      return {
        candidateId: candidate.candidateId,
        candidateName: candidate.candidateName,
        averageSimilarity: finalScore,
        topMatchScore: topChunkScore,
        matchedSections: [
          ...new Set(
            candidate.chunks.map(
              (chunk) => chunk.section
            )
          ),
        ],
        chunks: candidate.chunks,
      };
    })
    .sort(
      (a, b) =>
        b.averageSimilarity -
        a.averageSimilarity
    );
}