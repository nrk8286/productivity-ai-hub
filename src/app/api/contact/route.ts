import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(5000),
});

export async function POST(request: NextRequest) {
  let body;
  try {
    const text = await request.text();
    if (text.length > 12000) return NextResponse.json({ error: "Message is too large" }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Check your contact details and message" }, { status: 400 });
  try {
    await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ received: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not save your message. Please try again later." }, { status: 503 });
  }
}
