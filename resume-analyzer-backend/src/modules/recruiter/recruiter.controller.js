import asyncHandler from "../../shared/utils/asyncHandler.js";

import { searchCandidates } from "./recruiter.service.js";

export const searchCandidatesController =
    asyncHandler(async (req, res) => {
        const { recruiterQuery } = req.body;

        if (!recruiterQuery) {
            return res.status(400).json({
                message: "recruiterQuery is required",
            });
        }

        const result = await searchCandidates({
            recruiterQuery,
            userId: req.user.id,
        });

        res.json(result);
    });