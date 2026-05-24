import User from "../../modules/auth/user.model.js";
import { retry } from "../utils/retry.util.js";
import { OPENAI_CONFIG } from "./ai.config.js";
import { generateWithOpenAI } from "./providers/openai.provider.js";
import { logAIRequest } from "./ai.logger.js";
import AppError from "../errors/AppError.js";

/**
 * Task-based AI behavior control
 */
const TASK_CONFIG = {
  RESUME_ANALYSIS: {
    temperature: 0.2,
    maxTokens: 1200,
  },
  COVER_LETTER: {
    temperature: 0.6,
    maxTokens: 800,
  },
  RAG_RESUME_ANALYSIS: {
    maxTokens: 1200,
    temperature: 0.2,
  }
};

/**
 * Normalize provider errors into safe app errors
 */
function normalizeAIError(error) {
  console.error("RAW AI ERROR:", error);

  if (error?.status === 429) {
    return new AppError("AI service rate limited. Try again later.", 429);
  }

  if (error?.status >= 500) {
    return new AppError("AI service temporarily unavailable.", 503);
  }

  return new AppError("AI request failed.", 400);
}

/**
 * Quota enforcement
 */
async function checkUserUsage(userId) {
  const user = await User.findById(userId);

  if (!user) throw new AppError("USER_NOT_FOUND", 404);

  const now = new Date();

  // Initialize reset date if missing
  if (!user.usageResetDate) {
    user.usageResetDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    await user.save();
  }

  // Monthly reset
  if (now > user.usageResetDate) {
    user.tokensUsed = 0;
    user.usageResetDate = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );
    await user.save();
  }

  // Enforce quota
  if (user.tokensUsed >= user.monthlyTokenLimit) {
    throw new AppError("TOKEN_LIMIT_EXCEEDED", 403);
  }

  return user;
}

/**
 * Execute with retry
 */
async function executeWithRetry(model, payload, taskConfig, userId) {
  return retry(
    () =>
      generateWithOpenAI({
        ...payload,
        model,
        temperature: taskConfig.temperature,
        maxTokens: taskConfig.maxTokens,
        timeoutMs: OPENAI_CONFIG.REQUEST_TIMEOUT_MS,
        userId,
      }),
    {
      retries: 3,
      shouldRetry: (err) =>
        err?.status === 429 ||
        err?.status >= 500 ||
        err?.code === "ECONNRESET",
      onRetry: (_, attempt) => {
        console.log(`Retrying AI call (${model}) - Attempt ${attempt}`);
      },
    }
  );
}

/**
 * Fallback execution strategy
 */
async function executeWithFallback(payload, taskConfig, userId) {
  try {
    console.log("Using PRIMARY model:", OPENAI_CONFIG.PRIMARY_MODEL);
    return await executeWithRetry(
      OPENAI_CONFIG.PRIMARY_MODEL,
      payload,
      taskConfig,
      userId
    );
  } catch (primaryError) {
    console.warn("Primary model failed. Switching to fallback model...");

    try {
      return await executeWithRetry(
        OPENAI_CONFIG.FALLBACK_MODEL,
        payload,
        taskConfig,
        userId
      );
    } catch (fallbackError) {
      throw normalizeAIError(fallbackError);
    }
  }
}

/**
 * Public AI execution API
 */
export async function generateAIResponse(payload, userId) {
  const start = Date.now();
  const user = await checkUserUsage(userId);

  const taskConfig = TASK_CONFIG[payload.task];
  if (!taskConfig) throw new AppError("INVALID_AI_TASK", 400);

  try {
    const result = await executeWithFallback(payload, taskConfig, userId);
    console.log("RESULT:", result);
    const tokensUsed = result?.usage?.total_tokens || 0;

    // 🧠 Prevent post-call overflow
    if (user.tokensUsed + tokensUsed > user.monthlyTokenLimit) {
      throw new AppError("TOKEN_LIMIT_EXCEEDED", 403);
    }

    // ✅ Atomic increment (no race condition)
    await User.findByIdAndUpdate(userId, {
      $inc: { tokensUsed: tokensUsed },
    });

    await logAIRequest({
      userId,
      task: payload.task,
      model: result.model,
      tokensUsed,
      latencyMs: Date.now() - start,
      status: "SUCCESS",
    });

    return result;

  } catch (error) {
    await logAIRequest({
      userId,
      task: payload.task,
      status: "FAILED",
      error: error.message,
      latencyMs: Date.now() - start,
    });
    throw normalizeAIError(error);
  }
}