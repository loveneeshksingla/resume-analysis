import { useState } from "react";
import { uploadResume, getResumeStatus } from "../api/resume.api";

export function useResumeAnalysis() {
  const [status, setStatus] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const analyze = async (file) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResume(formData);

      const resumeId = res.data.resumeId;

      setStatus("PENDING");

      pollStatus(resumeId);

    } catch (err) {
      console.error(err);
      setStatus("FAILED");
    }
  };

  const pollStatus = (resumeId) => {
    const interval = setInterval(async () => {
      try {
        const res = await getResumeStatus(resumeId);

        if (res.data.status === "COMPLETED") {
          setAnalysis(res.data.analysis);
          setStatus("COMPLETED");
          clearInterval(interval);
        }

        if (res.data.status === "FAILED") {
          setStatus("FAILED");
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
        setStatus("FAILED");
        clearInterval(interval);
      }
    }, 2000);
  };

  return { analyze, status, analysis };
}