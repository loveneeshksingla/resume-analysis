import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: String,
      required: true,
    },

    model: {
      type: String,
    },

    tokensUsed: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
    },

    latencyMs: Number,

    error: String,
  },
  { timestamps: true }
);

export default mongoose.model("AIRequestLog", aiLogSchema);