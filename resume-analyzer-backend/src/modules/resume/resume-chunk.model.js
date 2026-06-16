import mongoose from "mongoose";

const resumeChunkSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },

    candidateName: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
      index: true,
    },

    company: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      default: null,
    },

    project: {
      type: String,
      default: null,
    },

    duration: {
      type: String,
      default: null,
    },

    content: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ResumeChunk",
  resumeChunkSchema
);