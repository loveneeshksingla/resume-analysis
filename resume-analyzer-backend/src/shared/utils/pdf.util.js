import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ now works

export async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);

  console.log("Extracted text: =>>>>>", data.text);
  return data.text;
}