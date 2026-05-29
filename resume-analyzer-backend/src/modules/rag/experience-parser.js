// experience-parser.js

function isDateLine(text) {
  const line = text.trim();

  return (
    /\b\d{1,2}[\/-]\d{4}\b/.test(line) ||
    /\b\d{4}\s*[-–]\s*\d{4}\b/.test(line) ||
    /\b\d{1,2}[\/-]\d{4}\s*[-–]\s*(Present|Current|\d{1,2}[\/-]\d{4})\b/i.test(
      line
    ) ||
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(line)
  );
}

function isBullet(line) {
  return (
    line.startsWith("•") ||
    line.startsWith("-") ||
    line.startsWith("*")
  );
}

export function parseExperienceChunks(chunks) {
  const experienceSection = chunks.find(
    (chunk) => chunk.section === "EXPERIENCE"
  );

  if (!experienceSection) {
    return [];
  }

  const lines = experienceSection.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const jobs = [];

  let currentJob = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // New job starts whenever we find a date line
    if (isDateLine(line)) {
      if (currentJob) {
        jobs.push(currentJob);
      }

      const company = lines[i - 2] || "";
      const role = lines[i - 1] || "";

      currentJob = {
        section: "EXPERIENCE",
        company,
        role,
        duration: line,
        content: [],
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
    section: "EXPERIENCE",
    company: job.company,
    role: job.role,
    duration: job.duration,
    content: job.content.join("\n").trim(),
  }));
}