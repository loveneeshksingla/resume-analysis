import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    endpoint: {
      type: String,
      required: true
    },

    requestHash: {
      type: String,
      required: true
    },

    response: {
      type: mongoose.Schema.Types.Mixed
    },

    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED"],
      default: "PROCESSING"
    }
  },
  { timestamps: true }
);

const Idempotency = mongoose.model("Idempotency", idempotencySchema);

export default Idempotency;