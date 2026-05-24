import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import resumeRoutes from "../modules/resume/resume.routes.js";
import jobMatchRoutes from "../modules/job-match/job-match.routes.js";
import recruiterRoutes from "../modules/recruiter/recruiter.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/resume", resumeRoutes);
router.use("/job", jobMatchRoutes);
router.use("/recruiter", recruiterRoutes);

export default router;