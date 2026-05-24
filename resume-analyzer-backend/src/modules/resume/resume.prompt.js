export function buildResumeAnalysisPrompt(resumeText) {
  return [
    {
      role: "system",
      content: `
You are a senior tech recruiter with 8+ years of experience.
Analyze strictly based on the resume.
If information is missing, return "UNKNOWN".
Respond ONLY in valid JSON.
DO NOT add markdown or extra text.
      `,
    },
    {
      role: "user",
      content: `
Analyze this resume:

${resumeText}

Return JSON:
{
  "resumeScore": number,
  "overallFeedback": string,
  "weakPoints": [string],
  "improvementSuggestions": [string],
  "atsScore": number
}
      `,
    },
  ];
}