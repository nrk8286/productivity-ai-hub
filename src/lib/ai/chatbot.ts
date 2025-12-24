import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY is not defined");
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatbotOptions {
  messages: ChatMessage[];
  context?: string;
  maxTokens?: number;
}

export async function chat(options: ChatbotOptions) {
  const { messages, context, maxTokens = 1000 } = options;

  const systemPrompt = `You are a helpful AI assistant for Productivity AI Hub, a platform that helps remote teams work more efficiently. 

${context ? `Context: ${context}` : ""}

Your responsibilities:
- Answer questions about productivity, remote work, and AI automation
- Recommend tools and strategies from our platform
- Help users understand features and best practices
- Be friendly, concise, and actionable

Guidelines:
- Keep responses under 200 words unless more detail is requested
- Use bullet points for lists
- Provide specific, actionable advice
- Reference our blog posts and tools when relevant
- If you don't know something, say so and offer to connect them with support`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const response = message.content[0];
    if (response.type === "text") {
      return {
        success: true,
        message: response.text,
        usage: message.usage,
      };
    }

    return {
      success: false,
      error: "Unexpected response format",
    };
  } catch (error) {
    console.error("Chatbot error:", error);
    return {
      success: false,
      error,
    };
  }
}

export async function suggestNextQuestions(
  conversationHistory: ChatMessage[]
): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 200,
      messages: [
        ...conversationHistory,
        {
          role: "user",
          content:
            "Based on our conversation, suggest 3 follow-up questions I might want to ask. Format as a simple numbered list.",
        },
      ],
    });

    const content = message.content[0];
    if (content.type === "text") {
      return content.text
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, ""))
        .slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error("Error suggesting questions:", error);
    return [];
  }
}

export function getChatbotContext(userInfo?: {
  subscriptionTier?: string;
  interests?: string[];
}): string {
  let context = "The user is currently browsing our website.";

  if (userInfo?.subscriptionTier) {
    context += ` They are on the ${userInfo.subscriptionTier} plan.`;
  }

  if (userInfo?.interests && userInfo.interests.length > 0) {
    context += ` They are interested in: ${userInfo.interests.join(", ")}.`;
  }

  return context;
}
