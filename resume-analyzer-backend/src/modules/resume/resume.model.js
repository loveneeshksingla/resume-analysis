import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
  {
    resumeScore: Number,
    overallFeedback: String,
    weakPoints: [String],
    improvementSuggestions: [String],
    atsScore: Number,
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rawText: {
      type: String,
      required: true,
    },
    analysis: analysisSchema,
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    aiUsage: {
      promptTokens: { type: Number, default: 0 },
      completionTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);
