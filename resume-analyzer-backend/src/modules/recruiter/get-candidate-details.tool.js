import ResumeChunk from "../resume/resume-chunk.model.js";

export async function getCandidateDetails({ candidateId }) {
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