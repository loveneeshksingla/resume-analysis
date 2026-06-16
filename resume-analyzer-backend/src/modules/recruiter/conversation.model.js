import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["system", "user", "assistant"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { _id: false }
);

const ConversationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        messages: {
            type: [MessageSchema],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "RecruiterConversation",
    ConversationSchema
);