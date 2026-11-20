import { NextRequest, NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics/tracking";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const trackSchema = z.object({
  event: z.string().min(1),
  properties: z.record(z.any()).optional(),
  sessionId: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validated = trackSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const result = await trackEvent({ ...validated.data, userId: session?.user?.id });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to track event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track event error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
