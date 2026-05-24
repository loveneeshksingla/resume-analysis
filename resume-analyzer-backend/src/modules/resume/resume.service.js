import Resume from "./resume.model.js";
import { generateAIResponse } from "../../shared/ai/ai.service.js";
import { ResumeAnalysisSchema } from "./resume.schema.js";
import { buildResumeAnalysisPrompt } from "./resume.prompt.js";
import { saveIdempotentResponse } from "../../shared/idempotency/idempotency.service.js";
import { indexResume } from "./resume-indexing.service.js";

export async function processResumeAnalysis({
  resumeId,
  userId,
  resumeText,
  idempotencyRecordId,
}) {
  try {
    console.log(`[Service] Starting analysis for resume ${resumeId}`);
    const candidateName = extractCandidateName(resumeText);
    await indexResume({ resumeId, userId, candidateName, resumeText });
    const messages = buildResumeAnalysisPrompt(resumeText);

    const aiResult = await generateAIResponse(
      {
        task: "RESUME_ANALYSIS",
        messages,
      },
      userId
    );

    console.log(`[Service] AI Result for resume ${resumeId}:`, aiResult);
    if (!aiResult?.content) {
      throw new Error("Invalid AI response format");
    }

    const validated = ResumeAnalysisSchema.parse(aiResult.content);
    console.log(`[Service] Validated analysis for resume ${resumeId}:`, validated);

    await Resume.findByIdAndUpdate(resumeId, {
      analysis: validated,
      aiUsage: {
        promptTokens: aiResult.usage?.prompt_tokens || 0,
        completionTokens: aiResult.usage?.completion_tokens || 0,
        totalTokens: aiResult.usage?.total_tokens || 0,
      },
      status: "COMPLETED",
    });

    await saveIdempotentResponse(idempotencyRecordId, { status: "COMPLETED", resumeId, analysis: validated });

  } catch (error) {
    await Resume.findByIdAndUpdate(resumeId, { status: "FAILED"});
    await saveIdempotentResponse(idempotencyRecordId, { status: "FAILED", resumeId });
    throw error;
  }
}

function extractCandidateName(resumeText) {
  const firstLine = resumeText
    .split("\n")
    .find(line => line.trim());

  return firstLine?.trim() || "Unknown Candidate";
}