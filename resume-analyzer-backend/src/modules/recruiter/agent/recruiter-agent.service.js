import OpenAI from "openai";
import { recruiterTools } from "./recruiter.tools.js";
import { executeTool } from "./tool-executor.js";
import { OPENAI_CONFIG } from "../../../shared/ai/ai.config.js";
import {
    getConversationHistory,
    saveConversationMessage,
} from "../conversation.service.js";

const openai = new OpenAI({
    apiKey: OPENAI_CONFIG.API_KEY,
    baseURL: OPENAI_CONFIG.BASE_URL,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:8000",
        "X-Title": "Resume Analyzer App",
    },
});

export async function runRecruiterAgent({ message, userId }) {

    const history = await getConversationHistory({ userId });

    const messages = [
        {
            role: "system",
            content: `
You are a recruiter AI agent.

Rules:
- Use available tools whenever candidate information is needed.
- Never invent candidate data.
- Always prefer tool results over assumptions.
- If candidate details are required, use the appropriate candidate detail tool.
- If outreach email is requested, generate it using the outreach email tool.
- Never invent recruiter name.
- Never invent company name.
- If recruiter information is missing, use generic placeholders.
`,
        },
        ...history,
        {
            role: "user",
            content: message,
        },
    ];

    const MAX_ITERATIONS = 5;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        const response = await openai.chat.completions.create({
            model: OPENAI_CONFIG.PRIMARY_MODEL,
            messages,
            tools: recruiterTools,
            tool_choice: "auto",
            max_tokens: 800,
        });

        const aiMessage = response.choices[0].message;
        messages.push(aiMessage);

        console.log(`Agent iteration ${i + 1}`);
        console.log(aiMessage, "<==== aiMessage ==========");

        if (!aiMessage.tool_calls?.length) {
            await saveConversationMessage({
                userId,
                role: "user",
                content: message,
            });

            await saveConversationMessage({
                userId,
                role: "assistant",
                content: aiMessage.content,
            });

            return {
                type: "agent_response",
                content: aiMessage.content,
            };
        }

        for (const toolCall of aiMessage.tool_calls) {
            const toolName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments || "{}");

            console.log(toolName, "<==== toolName ==========");
            console.log(args, "<==== args ==========");

            const toolResult = await executeTool({
                toolName,
                args,
                userId,
            });

            console.log(toolResult, "<==== toolResult ==========");

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult),
            });
        }
    }

    return {
        type: "agent_response",
        content: "Agent stopped because maximum tool iterations were reached.",
    };
}