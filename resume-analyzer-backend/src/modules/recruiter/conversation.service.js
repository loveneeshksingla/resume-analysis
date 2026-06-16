import RecruiterConversation from "./conversation.model.js";

const MAX_HISTORY_MESSAGES = 10;

export async function getConversationHistory({ userId }) {
    const conversation = await RecruiterConversation.findOne({ userId }).lean();

    if (!conversation) {
        return [];
    }

    return conversation.messages.slice(-MAX_HISTORY_MESSAGES);
}

export async function saveConversationMessage({ userId, role, content }) {
    let conversation = await RecruiterConversation.findOne({ userId });

    if (!conversation) {
        conversation = await RecruiterConversation.create({
            userId,
            messages: [],
        });
    }

    conversation.messages.push({
        role,
        content,
    });

    // keep only latest messages
    conversation.messages = conversation.messages.slice(-MAX_HISTORY_MESSAGES);

    await conversation.save();

    return conversation;
}