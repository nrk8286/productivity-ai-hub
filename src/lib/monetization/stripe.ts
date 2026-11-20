import Stripe from "stripe";
import { prisma } from "../db";
import { processBillingEvent } from "./billing";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true, timeout: 10000, maxNetworkRetries: 1 }) : null;
export const PRICE_IDS = {
  PROFESSIONAL: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
  ENTERPRISE: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

export async function createCheckoutSession({ priceId, userId, userEmail, successUrl, cancelUrl }: {
  priceId: string; userId: string; userEmail: string; successUrl: string; cancelUrl: string;
}) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return { session: null, error: new Error("Billing not configured") };
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Account not found");
    if (user.stripeSubscriptionId) throw new Error("Manage your existing subscription through the billing portal");
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      ...(user.stripeCustomerId ? { customer: user.stripeCustomerId } : { customer_email: userEmail }),
      subscription_data: { metadata: { userId } },
      metadata: { userId },
      integration_identifier: "productivity-hub-jnqvsztr",
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    }, { idempotencyKey: `checkout:${userId}:${priceId}:${Math.floor(Date.now() / 300000)}` });
    return { session, error: null };
  } catch { return { session: null, error: new Error("Checkout unavailable") }; }
}

export async function createCustomerPortalSession({ customerId, returnUrl }: { customerId: string; returnUrl: string }) {
  if (!stripe) return { session: null, error: new Error("Billing not configured") };
  try { return { session: await stripe.billingPortal.sessions.create({ customer: customerId, return_url: returnUrl }), error: null }; }
  catch { return { session: null, error: new Error("Billing portal unavailable") }; }
}

export async function handleWebhookEvent(event: Stripe.Event) {
  if (!stripe) throw new Error("Billing not configured");
  return processBillingEvent(event, { stripe, db: prisma, prices: PRICE_IDS });
}

export function constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event | null {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return null;
  try { return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch { return null; }
}
