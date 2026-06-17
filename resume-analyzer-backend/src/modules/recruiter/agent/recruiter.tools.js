export const recruiterTools = [
    {
        type: "function",
        function: {
            name: "searchCandidates",
            description: "Search matching candidates from indexed resumes.",
            parameters: {
                type: "object",
                properties: {
                    recruiterQuery: {
                        type: "string",
                        description: "Recruiter search query",
                    },
                },
                required: ["recruiterQuery"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "getCandidateDetails",
            description: "Get full resume details for a specific candidate. IMPORTANT: You MUST use the exact candidateId from the searchCandidates results. The candidateId is a MongoDB ObjectId string (like '507f1f77bcf86cd799439011'), NOT a UUID. Always copy the exact candidateId from previous search results - do NOT generate or invent IDs.",
            parameters: {
                type: "object",
                properties: {
                    candidateId: {
                        type: "string",
                        description: "Exact candidateId from searchCandidates results (MongoDB ObjectId format). Example: '507f1f77bcf86cd799439011'",
                    },
                },
                required: ["candidateId"],
            },
        },
    },
    {
    type: "function",
    function: {
        name: "generateOutreachEmail",
        description: "Generate a personalized outreach email for a candidate.",
        parameters: {
            type: "object",
            properties: {
                candidateName: {
                    type: "string",
                },
                candidateSkills: {
                    type: "array",
                    items: { type: "string" },
                },
                candidateExperience: {
                    type: "string",
                },
                role: {
                    type: "string",
                },
                companyName: {
                    type: "string",
                },
                recruiterName: {
                    type: "string",
                },
            },
            required: ["candidateName"],
        },
    },
}
];