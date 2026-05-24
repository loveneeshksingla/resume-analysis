function isDateLine(text) {
  return (
    /\b\d{2}\/\d{4}\b/.test(text) ||
    /\b\d{4}\s*[-–]\s*\d{4}\b/.test(text) ||
    /\b\d{2}\/\d{4}\s*[-–]\s*(Present|Current|\d{2}\/\d{4})\b/i.test(text)
  );
}

export function parseProjectChunks(chunks) {
  const projectSection = chunks.find(
    chunk => chunk.section === "PROJECTS"
  );

  if (!projectSection) {
    return [];
  }

  const lines = projectSection.content
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const projects = [];

  let currentProject = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isDateLine(line)) {
      if (currentProject) {
        projects.push(currentProject);
      }

      currentProject = {
        section: "PROJECTS",
        project: lines[i - 1] || "",
        duration: line,
        content: []
      };

      continue;
    }

    if (currentProject) {
      currentProject.content.push(line);
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  return projects.map((project, index) => ({
    id: index + 1,
    section: project.section,
    project: project.project,
    duration: project.duration,
    content: project.content.join("\n").trim()
  }));
}