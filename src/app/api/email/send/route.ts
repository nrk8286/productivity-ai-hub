import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/send";
import { z } from "zod";

const emailSchema = z.object({
  to: z.string().email().or(z.array(z.string().email())),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
  replyTo: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validated = emailSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validated.error },
        { status: 400 }
      );
    }

    const result = await sendEmail(validated.data);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
