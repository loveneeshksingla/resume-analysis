import asyncHandler from "../../shared/utils/asyncHandler.js";
import { checkIdempotency, saveIdempotentResponse } from "../../shared/idempotency/idempotency.service.js";
import { resumeQueue } from "./resume.queue.js";
import Resume from "./resume.model.js";
import { extractTextFromPDF } from "../../shared/utils/pdf.util.js";

// 🚀 Enqueue API
export const analyzeResumeController = asyncHandler(async (req, res) => {
  const idempotencyKey = req.headers["idempotency-key"];

  let resumeText = "";
  console.log("Received file:", req.file);

  if (req.file) {
    resumeText = await extractTextFromPDF(req.file.buffer);
  }

  if (!resumeText && req.body.resumeText) {
    resumeText = req.body.resumeText;
  }

  if (!resumeText) {
    return res.status(400).json({ message: "Resume is required" });
  }

  const { record, cachedResponse } = await checkIdempotency({
    key: idempotencyKey, userId: req.user.id,
    endpoint: "resume-analysis", payload: req.body
  });

  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  await Resume.updateMany({user: req.user.id, isActive: true}, { isActive: false });

  const resume = await Resume.create({
    user: req.user.id,
    rawText: resumeText,
    status: "PENDING",
  });

  await resumeQueue.add("resume-analysis", {
    resumeId: resume._id,
    userId: req.user.id,
    resumeText: resumeText,
    idempotencyRecordId: record._id,
  });

  const response = {
    status: "PENDING",
    resumeId: resume._id,
  };

  await saveIdempotentResponse(record._id, response);

  res.status(202).json(response);
});


// 📊 Status API (polling)
export const getResumeStatusController = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  res.json({
    status: resume.status,
    analysis: resume.status === "COMPLETED" ? resume.analysis : null,
  });
});


export const getUserResumesController = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.params.userId })
    .sort({ createdAt: -1 })
    .select("status analysis createdAt");

  res.json(resumes);
});