export function rankCandidates(retrievedChunks) {
  const candidates = {};

  for (const chunk of retrievedChunks) {
    if (!candidates[chunk.candidateId]) {
      candidates[chunk.candidateId] = {
        candidateId: chunk.candidateId,
        candidateName: chunk.candidateName,
        totalSimilarity: 0,
        chunkCount: 0,
        chunks: [],
      };
    }

    candidates[chunk.candidateId].totalSimilarity += chunk.similarity;
    candidates[chunk.candidateId].chunkCount += 1;
    candidates[chunk.candidateId].chunks.push(chunk);
  }

  return Object.values(candidates)
    .map(candidate => ({
      ...candidate,
      averageSimilarity:
        candidate.totalSimilarity / candidate.chunkCount,
    }))
    .sort((a, b) => b.averageSimilarity - a.averageSimilarity);
}