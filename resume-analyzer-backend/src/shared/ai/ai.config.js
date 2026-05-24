export const OPENAI_CONFIG = {
  PRIMARY_MODEL: "openai/gpt-4o-mini",
  FALLBACK_MODEL: "openai/gpt-3.5-turbo",
  TEMPERATURE: 0.2,
  MAX_TOKENS: 1000,
  API_KEY: process.env.OPENAI_API_KEY,
  BASE_URL: "https://openrouter.ai/api/v1",
  REQUEST_TIMEOUT_MS: 15000, // 15 seconds
};