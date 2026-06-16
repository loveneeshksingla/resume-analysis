import asyncHandler from "../../shared/utils/asyncHandler.js";
import { runRecruiterAgent } from "./agent/recruiter-agent.service.js";

import { searchCandidates } from "./searchCandidates.service.js";

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

export const recruiterAgentController =
    asyncHandler(async (req, res) => {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "message is required",
            });
        }

        const result = await runRecruiterAgent({
            message,
            userId: req.user.id,
        });

        res.json(result);
    });