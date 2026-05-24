import ResumeChunk from "./resume-chunk.model.js";

import { chunkResume } from "../rag/chunking.service.js";
import { buildEmbeddingChunks } from "../rag/build-embedding-chunks.service.js";
import { embedChunks } from "../rag/rag-embedding.service.js";

export async function indexResume({
    resumeId,
    userId,
    candidateName,
    resumeText,
}) {
    await ResumeChunk.deleteMany({ resumeId });

    const sectionChunks = chunkResume(resumeText);
    const embeddingChunks = buildEmbeddingChunks(sectionChunks);
    const embeddedChunks = await embedChunks(embeddingChunks);

    const docs = embeddedChunks.map(chunk => ({
        resumeId,
        userId,
        candidateName,
        section: chunk.section,
        company: chunk.company || null,
        role: chunk.role || null,
        project: chunk.project || null,
        duration: chunk.duration || null,
        content: chunk.content,
        embedding: chunk.embedding,
    }));

    await ResumeChunk.insertMany(docs);

    return docs.length;
}