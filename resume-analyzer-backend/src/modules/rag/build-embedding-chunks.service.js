import { parseExperienceChunks } from "./experience-parser.js";
import { parseProjectChunks } from "./project-parser.js";

export function buildEmbeddingChunks(sectionChunks) {
    const embeddingChunks = [];

    const experienceChunks =
        parseExperienceChunks(sectionChunks);

    const projectChunks = parseProjectChunks(sectionChunks);

    // Keep SUMMARY, SKILLS, EDUCATION, CERTIFICATIONS etc.
    sectionChunks
        .filter(
            chunk =>
                chunk.section !== "EXPERIENCE" &&
                chunk.section !== "PROJECTS"
        )
        .forEach(chunk => {
            embeddingChunks.push({
                section: chunk.section,
                content: chunk.content,
            });
        });

    // Add parsed experience chunks
    experienceChunks.forEach(exp => {
        embeddingChunks.push({
            section: "EXPERIENCE",
            company: exp.company,
            role: exp.role,
            duration: exp.duration,

            content: `
Company: ${exp.company}
Role: ${exp.role}
Duration: ${exp.duration}

${exp.content}
      `.trim(),
        });
    });

    // Add parsed project chunks
    projectChunks.forEach(project => {
        embeddingChunks.push({
            section: "PROJECTS",
            project: project.project,
            duration: project.duration,

            content: `
Project: ${project.project}
Duration: ${project.duration}

${project.content}
      `.trim(),
        });
    });

    return embeddingChunks;
}