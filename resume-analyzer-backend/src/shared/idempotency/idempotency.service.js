import Idempotency from "./idempotency.model.js";
import { hashRequest } from "../utils/hash.util.js";
import AppError from "../errors/AppError.js";

export async function checkIdempotency({ key, userId, endpoint, payload }) {
  const requestHash = hashRequest(payload);

  const existing = await Idempotency.findOne({ key });

  if (!existing) {
    const record = await Idempotency.create({
      key,
      user: userId,
      endpoint,
      requestHash,
      status: "PROCESSING"
    });

    return { record, cachedResponse: null };
  }

  if (existing.requestHash !== requestHash) {
    throw new AppError(
      "IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD",
      400
    );
  }

  if (existing.status === "COMPLETED") {
    return { cachedResponse: existing.response };
  }

  throw new AppError("REQUEST_ALREADY_PROCESSING", 409);
}

export async function saveIdempotentResponse(recordId, response) {
  await Idempotency.findByIdAndUpdate(recordId, {
    status: "COMPLETED",
    response
  });
}