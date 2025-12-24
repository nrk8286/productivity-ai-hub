import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PRICE_IDS } from "@/lib/monetization/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const { planType } = body;

    if (!planType || !["professional", "enterprise"].includes(planType.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid plan type" },
        { status: 400 }
      );
    }

    const priceId = planType.toLowerCase() === "professional" 
      ? PRICE_IDS.PROFESSIONAL 
      : PRICE_IDS.ENTERPRISE;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { session: checkoutSession, error } = await createCheckoutSession({
      priceId,
      userId: session.user.id,
      userEmail: session.user.email!,
      successUrl: `${baseUrl}/dashboard?success=true`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    });

    if (error || !checkoutSession) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
