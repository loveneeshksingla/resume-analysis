import express from "express";
import { analyzeResumeController, getResumeStatusController, getUserResumesController } from "./resume.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { analyzeResumeSchema } from "./resume.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { aiRateLimiter } from "../../middlewares/aiRateLimiter.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  validate(analyzeResumeSchema),
  aiRateLimiter,
  upload.single("resume"),
  analyzeResumeController
);

router.get(
  "/get-status/:id",
  protect,
  aiRateLimiter,
  getResumeStatusController
);

router.get(
  "/history/:userId",
  protect,
  aiRateLimiter,
  getUserResumesController
);

export default router;
