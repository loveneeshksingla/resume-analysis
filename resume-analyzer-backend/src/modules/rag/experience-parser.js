function isDateLine(text) {
  return (
    /\b\d{2}\/\d{4}\b/.test(text) ||
    /\b\d{4}\s*[-–]\s*\d{4}\b/.test(text) ||
    /\b\d{2}\/\d{4}\s*[-–]\s*(Present|Current|\d{2}\/\d{4})\b/i.test(text)
  );
}

export function parseExperienceChunks(chunks) {
  const experienceSection = chunks.find(
    chunk => chunk.section === "EXPERIENCE"
  );

  if (!experienceSection) {
    return [];
  }

  const lines = experienceSection.content
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const jobs = [];

  let currentJob = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isDateLine(line)) {
      if (currentJob) {
        jobs.push(currentJob);
      }

      currentJob = {
        section: "EXPERIENCE",
        company: lines[i - 2] || "",
        role: lines[i - 1] || "",
        duration: line,
        content: []
      };

      continue;
    }

    if (currentJob) {
      currentJob.content.push(line);
    }
  }

  if (currentJob) {
    jobs.push(currentJob);
  }

  return jobs.map((job, index) => ({
    id: index + 1,
    section: job.section,
    company: job.company,
    role: job.role,
    duration: job.duration,
    content: job.content.join("\n").trim()
  }));
}