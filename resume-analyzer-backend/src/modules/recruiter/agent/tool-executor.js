import { searchCandidates } from "../searchCandidates.service.js";
import { getCandidateDetails } from "../get-candidate-details.tool.js";
import { generateOutreachEmail } from "../generate-outreach-email.tool.js";

export async function executeTool({ toolName, args, userId }) {
    if (toolName === "searchCandidates") {
        return await searchCandidates({
            recruiterQuery: args.recruiterQuery,
            userId,
        });
    }

    if (toolName === "getCandidateDetails") {
        return await getCandidateDetails({
            candidateId: args.candidateId,
            userId,
        });
    }

    if (toolName === "generateOutreachEmail") {
        return await generateOutreachEmail(args);
    }

    throw new Error(`Unknown tool: ${toolName}`);
}