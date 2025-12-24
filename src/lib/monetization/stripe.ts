import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : null;

export const PRICE_IDS = {
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "price_professional",
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
};

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    return { session: null, error: new Error("Stripe not configured") };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      customer_email: userEmail,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: {
        userId,
      },
    });

    return { session, error: null };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { session: null, error };
  }
}

export async function createCustomerPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  if (!stripe) {
    return { session: null, error: new Error("Stripe not configured") };
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { session, error: null };
  } catch (error) {
    console.error("Error creating portal session:", error);
    return { session: null, error };
  }
}

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Update user subscription status in database
      return { handled: true, data: session };
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      // Update subscription status in database
      return { handled: true, data: subscription };
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // Cancel subscription in database
      return { handled: true, data: subscription };
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      // Record successful payment
      return { handled: true, data: invoice };
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      // Handle failed payment
      return { handled: true, data: invoice };
    }

    default:
      return { handled: false, data: null };
  }
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !stripe) {
    console.error("Stripe webhook secret or client not configured");
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}
