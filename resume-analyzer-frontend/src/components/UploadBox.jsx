import { useState } from "react";

export default function UploadBox({ onUpload }) {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onUpload(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
        
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="text-lg font-semibold text-gray-700">
            Upload your resume
          </p>
          <p className="text-sm text-gray-500">
            PDF only • Max 2MB
          </p>

          {fileName && (
            <p className="mt-2 text-green-600 text-sm">
              {fileName}
            </p>
          )}
        </div>

        <input
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={handleChange}
        />
      </label>
    </div>
  );
}