import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/ai/content-generator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const generateSchema = z.object({
  topic: z.string().min(1),
  type: z.enum(["blog", "social", "email", "ad-copy"]),
  tone: z.enum(["professional", "casual", "friendly", "authoritative"]).optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
  targetAudience: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const validated = generateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validated.error },
        { status: 400 }
      );
    }

    const result = await generateContent(validated.data);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to generate content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      content: result.content,
      usage: result.usage,
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
