import { NextRequest, NextResponse } from "next/server";
import { chat, getChatbotContext } from "@/lib/ai/chatbot";
import { z } from "zod";

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1),
    })
  ),
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
