// chunking.service.js

const SECTION_ALIASES = {
  SUMMARY: [
    "PROFILE",
    "SUMMARY",
    "PROFESSIONAL SUMMARY",
    "ABOUT ME",
    "CAREER SUMMARY",
    "OBJECTIVE",
  ],

  SKILLS: [
    "SKILLS",
    "TECHNICAL SKILLS",
    "CORE SKILLS",
    "TECHNOLOGIES",
    "TECH STACK",
  ],

  EXPERIENCE: [
    "WORK EXPERIENCE",
    "EXPERIENCE",
    "EMPLOYMENT",
    "EMPLOYMENT HISTORY",
    "PROFESSIONAL EXPERIENCE",
    "CAREER HISTORY",
  ],

  EDUCATION: [
    "EDUCATION",
    "ACADEMIC BACKGROUND",
    "ACADEMICS",
    "QUALIFICATION",
    "QUALIFICATIONS",
  ],

  PROJECTS: [
    "PROJECTS",
    "LATEST PROJECTS",
    "PERSONAL PROJECTS",
    "KEY PROJECTS",
    "PROJECT EXPERIENCE",
  ],

  CERTIFICATIONS: [
    "CERTIFICATION",
    "CERTIFICATIONS",
    "CERTIFICATES",
    "LICENSES",
  ],

  ACHIEVEMENTS: [
    "ACHIEVEMENTS",
    "AWARDS",
    "HONORS",
  ],
};

function normalizeHeading(text) {
  const heading = text
    .trim()
    .replace(/[:]/g, "")
    .replace(/\s+/g, " ")
    .toUpperCase();

  for (const [section, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.includes(heading)) {
      return section;
    }
  }

  return null;
}

function isHeading(line) {
  const text = line.trim();

  if (!text) {
    return false;
  }

  if (text.length > 60) {
    return false;
  }

  return normalizeHeading(text) !== null;
}

export function chunkResume(resumeText) {
  const lines = resumeText
    .split("\n")
    .map(line => line.trim());

  const chunks = [];

  let currentSection = "GENERAL";
  let currentContent = [];

  function pushChunk() {
    if (!currentContent.length) {
      return;
    }

    chunks.push({
      id: chunks.length + 1,
      section: currentSection,
      content: currentContent.join("\n").trim(),
    });

    currentContent = [];
  }

  for (const line of lines) {
    if (!line) {
      continue;
    }

    const normalizedHeading = normalizeHeading(line);

    if (normalizedHeading) {
      pushChunk();

      currentSection = normalizedHeading;
      continue;
    }

    currentContent.push(line);
  }

  pushChunk();

  return chunks;
}