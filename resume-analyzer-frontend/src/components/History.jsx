import { useEffect, useState } from "react";
import { getResumeHistory } from "../api/resume.api";

export default function History({ onSelect }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await getResumeHistory();
      setData(res.data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="mt-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-3">Past Analyses</h2>

      {data.map((item) => (
        <div
          key={item._id}
          className="p-3 border rounded mb-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(item.analysis)}
        >
          <p>Status: {item.status}</p>
          <p className="text-sm text-gray-500">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}