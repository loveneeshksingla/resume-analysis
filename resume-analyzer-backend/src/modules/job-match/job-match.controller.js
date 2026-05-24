import asyncHandler from "../../shared/utils/asyncHandler.js";

import { matchResumeToJob } from "./job-match.service.js";

export const matchResumeController = asyncHandler(
  async (req, res) => {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "resumeText and jobDescription are required",
      });
    }

    const result = await matchResumeToJob({
      resumeText,
      jobDescription,
    });

    res.json(result);
  }
);