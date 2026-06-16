export async function generateOutreachEmail({
    candidateName,
    candidateSkills = [],
    candidateExperience,
    companyName = "our company",
    recruiterName = "a recruiter",
    role
}) {
    return {
        subject: `Opportunity for ${role || "a new role"}`,
        body: `
Hi ${candidateName},

I came across your profile and was impressed by your experience${candidateExperience ? ` of ${candidateExperience}` : ""}.

Your background in ${candidateSkills.join(", ")} looks highly relevant for our ${role || "open"} position at ${companyName}.

Would you be open to a quick conversation this week to discuss the opportunity?

Best regards,
${recruiterName}
        `.trim(),
    };
}