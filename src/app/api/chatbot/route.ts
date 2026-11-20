import { NextRequest, NextResponse } from "next/server";
import { chat, getChatbotContext } from "@/lib/ai/chatbot";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(8000),
    })
  ).min(1).max(25),
  userInfo: z.object({
    subscriptionTier: z.string().optional(),
    interests: z.array(z.string()).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validated = chatSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    if (!process.env.ANTHROPIC_API_KEY || !process.env.ANTHROPIC_MODEL) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }

    const { messages, userInfo } = validated.data;
    const context = userInfo ? getChatbotContext(userInfo) : undefined;

    const result = await chat({
      messages,
      context,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to get response" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: result.message,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
