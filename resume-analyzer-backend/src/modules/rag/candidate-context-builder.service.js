export function buildCandidateContext(rankedCandidates) {
    return rankedCandidates.map(candidate => `
        Candidate Name: ${candidate.candidateName}

        Match Score: ${(candidate.averageSimilarity * 100).toFixed(2)}%

        Relevant Resume Sections:

        ${candidate.chunks
                        .map(chunk => chunk.content)
                        .join("\n\n")}
        `)
                .join("\n====================\n");
}