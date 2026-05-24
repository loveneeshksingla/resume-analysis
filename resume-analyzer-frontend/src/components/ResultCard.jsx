export default function ResultCard({ data }) {
  const getColor = (score) => {
    if (score > 75) return "bg-green-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-6 p-6 rounded-2xl shadow-lg bg-white max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>

      {/* Scores */}
      <div className="mb-4">
        <p className="font-semibold">Resume Score</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`${getColor(data.resumeScore)} h-4 rounded-full`}
            style={{ width: `${data.resumeScore}%` }}
          />
        </div>
        <p className="text-sm mt-1">{data.resumeScore}/100</p>
      </div>

      <div className="mb-4">
        <p className="font-semibold">ATS Score</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className={`${getColor(data.atsScore)} h-4 rounded-full`}
            style={{ width: `${data.atsScore}%` }}
          />
        </div>
        <p className="text-sm mt-1">{data.atsScore}/100</p>
      </div>

      {/* Feedback */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Overall Feedback</h3>
        <p className="text-gray-700">{data.overallFeedback}</p>
      </div>

      {/* Weak Points */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-red-600">Weak Points</h3>
        <ul className="list-disc ml-5 text-gray-700">
          {data.weakPoints.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="font-semibold text-lg text-green-600">
          Improvement Suggestions
        </h3>
        <ul className="list-disc ml-5 text-gray-700">
          {data.improvementSuggestions.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}