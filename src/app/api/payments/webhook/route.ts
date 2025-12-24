import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, handleWebhookEvent } from "@/lib/monetization/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    const event = constructWebhookEvent(body, signature);

    if (!event) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const { handled, data } = await handleWebhookEvent(event);

    if (!handled) {
      console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true, handled });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
