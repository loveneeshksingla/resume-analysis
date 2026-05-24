import AIRequestLog from "./aiLog.model.js";

export async function logAIRequest({
  userId,
  task,
  model,
  tokensUsed,
  latencyMs,
  status,
  error,
}) {
  try {
    await AIRequestLog.create({
      user: userId,
      task,
      model,
      tokensUsed,
      latencyMs,
      status,
      error,
    });
  } catch (err) {
    console.error("AI logging failed:", err.message);
  }
}