import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ now works

export async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);

  return data.text;
}