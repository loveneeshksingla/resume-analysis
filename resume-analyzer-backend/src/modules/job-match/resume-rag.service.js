import { generateAIResponse } from "../../shared/ai/ai.service.js";

import { buildRagResumePrompt } from "./resume-rag.prompt.js";

export async function analyzeResumeWithRAG({
  resumeText,
  jobDescription,
  userId,
}) {
  const messages = buildRagResumePrompt({
    resumeText,
    jobDescription,
  });

  const result = await generateAIResponse(
    {
      task: "RAG_RESUME_ANALYSIS",
      messages,
    },
    userId
  );

  return result.content;
}