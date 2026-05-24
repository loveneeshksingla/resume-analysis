import ResumeChunk from "../resume/resume-chunk.model.js";

import { retrieveRelevantChunks } from "../rag/retrieval.service.js";
import { rankCandidates } from "../rag/candidate-ranking.service.js";
import { buildCandidateContext } from "../rag/candidate-context-builder.service.js";
import { buildRagPrompt } from "../rag/rag.prompt.js";

import { generateAIResponse } from "../../shared/ai/ai.service.js";
import { RecruiterAnalysisSchema } from "./recruiter-res-analysis.schema.js";

export async function searchCandidates({
    recruiterQuery,
    userId,
}) {
    const chunks = await ResumeChunk.find().lean();

    if (!chunks.length) {
        return {
            candidates: [],
            message: "No resumes indexed yet.",
        };
    }

    const indexedChunks = chunks.map((chunk) => ({
        candidateId: chunk.resumeId.toString(),
        candidateName: chunk.candidateName,
        content: chunk.content,
        embedding: chunk.embedding,
    }));

    const relevantChunks = await retrieveRelevantChunks({
        query: recruiterQuery,
        embeddedChunks: indexedChunks,
        topK: 10,
    });

    const rankedCandidates = rankCandidates(relevantChunks);

    const retrievedContext = buildCandidateContext(rankedCandidates);

    const messages = buildRagPrompt({ recruiterQuery, retrievedContext });

    const aiResult = await generateAIResponse(
        {
            task: "RAG_RESUME_ANALYSIS",
            messages,
        },
        userId
    );

    const validated = RecruiterAnalysisSchema.parse(aiResult.content);

    return validated;
}