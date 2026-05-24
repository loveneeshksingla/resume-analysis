import express from "express";

import { matchResumeController } from "./job-match.controller.js";

const router = express.Router();

router.post("/match", matchResumeController);

export default router;