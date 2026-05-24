import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    monthlyTokenLimit: {
      type: Number,
      default: 50000
    },
    usageResetDate: {
      type: Date
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
