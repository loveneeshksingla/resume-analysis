import OpenAI from "openai";
import { OPENAI_CONFIG } from "../ai.config.js";
import { withTimeout } from "../../utils/timeout.util.js";
import { logAIRequest } from "../ai.logger.js";

export const openAIClient = new OpenAI({
  apiKey: OPENAI_CONFIG.API_KEY,
  baseURL: OPENAI_CONFIG.BASE_URL,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:8000",
    "X-Title": "Resume Analyzer App",
  },
});

function safeParseJSON(text) {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON parse failed");
    console.error("RAW:", text);
    throw new Error("AI returned invalid JSON format");
  }
}

export async function generateWithOpenAI({
  messages,
  temperature = 0,
  maxTokens = 1000,
  timeoutMs = 15_000, // ⏱️ default 15 seconds
  userId,
  task
}) {
  let duration = 0;
  try {
    // ⏱️ Wrap AI call with timeout
    const start = Date.now();
    const response = await withTimeout(
      openAIClient.chat.completions.create({
        model: OPENAI_CONFIG.PRIMARY_MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: "json_object" }
      }),
      timeoutMs
    );
    duration = Date.now() - start;
    logAIRequest({ userId, task, model: OPENAI_CONFIG.PRIMARY_MODEL, usage: response.usage, duration, success: true });
    const rawContent = response?.choices?.[0]?.message?.content;

    if (!rawContent) {
      const error = new Error("Empty AI response");
      error.code = "AI_EMPTY_RESPONSE";
      throw error;
    }

    const parsed = safeParseJSON(rawContent);

    return {
      content: parsed,
      usage: response.usage,
      model: response.model,
    };
  } catch (error) {
    // 🧠 Normalize error
    console.error("❌ AI generation failed:", {
      code: error.code,
      message: error.message,
    });
    logAIRequest({ userId, model: OPENAI_CONFIG.PRIMARY_MODEL, duration, success: false, errorCode: error.code || "UNKNOWN_ERROR" });

    throw error;
  }
}
