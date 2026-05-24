import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  resumeScore: z.number().min(0).max(100),
  overallFeedback: z.string().min(10),
  weakPoints: z.array(z.string()).max(20),
  improvementSuggestions: z.array(z.string()).max(20),
  atsScore: z.number().min(0).max(100),
});