import mongoose from "mongoose";
import ResumeChunk from "../resume/resume-chunk.model.js";

export async function getCandidateDetails({ candidateId }) {
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
        return {
            candidate: null,
            message: "Invalid candidateId. candidateId must be the Mongo resumeId from searchCandidates result.",
            receivedCandidateId: candidateId,
        };
    }

    const chunks = await ResumeChunk.find({
        resumeId: candidateId,
    }).lean();

    if (!chunks.length) {
        return {
            candidate: null,
            message: "Candidate not found.",
        };
    }

    return {
        candidateId,
        candidateName: chunks[0].candidateName,
        sections: chunks.map((chunk) => ({
            section: chunk.section,
            company: chunk.company,
            role: chunk.role,
            project: chunk.project,
            duration: chunk.duration,
            content: chunk.content,
        })),
    };
}