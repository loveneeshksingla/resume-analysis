import { z } from "zod";

export const RecruiterAnalysisSchema = z.object({
  candidates: z.array(
    z.object({
      name: z.string(),
      matchScore: z.string(),

      matchedSkills: z
        .array(z.string())
        .optional(),

      summary: z.string(),

      strengths: z.array(z.string()),

      missingSkills: z.array(z.string()),

      recommendation: z.string(),
    })
  ),
});