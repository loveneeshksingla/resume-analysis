import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { OPENAI_CONFIG } from "./ai.config.js";

const client = new OpenAI({
  apiKey: OPENAI_CONFIG.API_KEY,
  baseURL: OPENAI_CONFIG.BASE_URL,
});

export async function createEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}