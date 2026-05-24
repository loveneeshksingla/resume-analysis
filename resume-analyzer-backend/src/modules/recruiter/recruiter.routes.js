import express from "express";

import { searchCandidatesController } from "./recruiter.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { aiRateLimiter } from "../../middlewares/aiRateLimiter.middleware.js";

const router = express.Router();

router.post(
    "/search", 
    protect,
    aiRateLimiter,
    searchCandidatesController
);

export default router;