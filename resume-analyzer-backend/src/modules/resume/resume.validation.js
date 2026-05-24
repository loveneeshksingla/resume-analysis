import Joi from "joi";

export const analyzeResumeSchema = Joi.object({
  resumeText: Joi.string().min(100).required(),
});
