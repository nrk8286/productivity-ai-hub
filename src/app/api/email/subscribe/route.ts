import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().default("website"),
  tags: z.array(z.string()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validated = subscribeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email, name, source, tags } = validated.data;

    // Check if already subscribed
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.status === "UNSUBSCRIBED") {
        // Resubscribe
        await prisma.subscriber.update({
          where: { email },
          data: { status: "ACTIVE", subscribedAt: new Date() },
        });

        return NextResponse.json({ 
          success: true, 
          message: "Resubscribed successfully" 
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Already subscribed" 
      });
    }

    // Create new subscriber
    await prisma.subscriber.create({
      data: {
        email,
        name,
        source,
        tags,
        status: "ACTIVE",
      },
    });

    // TODO: Send welcome email
    // await sendWelcomeEmail(email, name || "");

    return NextResponse.json({ 
      success: true, 
      message: "Subscribed successfully" 
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
