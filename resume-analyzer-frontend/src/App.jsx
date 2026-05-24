import UploadBox from "./components/UploadBox";
import { useResumeAnalysis } from "./hooks/useResumeAnalysis";
import ResultCard from "./components/ResultCard";
import History from "./components/History";
import { useState } from "react";

function App() {
  const { analyze, status, analysis } = useResumeAnalysis();
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Resume Analyzer 🚀</h1>

      <UploadBox onUpload={analyze} />

      {status === "UPLOADING" && <p>Uploading...</p>}
      {status === "PENDING" && <p>Analyzing your resume...</p>}
      {status === "FAILED" && <p>Something went wrong ❌</p>}

      {status === "COMPLETED" && analysis && (
        <ResultCard data={analysis} />
      )}

      {/* <History onSelect={setSelectedAnalysis} />

      {selectedAnalysis && (
        <ResultCard data={selectedAnalysis} />
      )} */}
    </div>
  );
}

export default App;