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
            description: "Get full resume details for a specific candidate by candidateId.",
            parameters: {
                type: "object",
                properties: {
                    candidateId: {
                        type: "string",
                        description: "Candidate resume id",
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