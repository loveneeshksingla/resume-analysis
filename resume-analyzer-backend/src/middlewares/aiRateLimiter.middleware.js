import rateLimit from "express-rate-limit";
import AppError from "../shared/errors/AppError.js";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // max requests per window
  keyGenerator: (req) => req.user?.id || req.ip,

  handler: () => {
    throw new AppError("AI_RATE_LIMIT_EXCEEDED", 429);
  },

  standardHeaders: true,
  legacyHeaders: false,
});