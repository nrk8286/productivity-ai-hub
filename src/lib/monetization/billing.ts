import type Stripe from "stripe";
import type { PrismaClient, SubscriptionTier } from "@prisma/client";

type Dependencies = { stripe: Stripe; db: PrismaClient; prices: { PROFESSIONAL?: string; ENTERPRISE?: string } };
const idOf = (value: string | { id: string } | null | undefined) => typeof value === "string" ? value : value?.id;
const active = (status: string) => status === "active" || status === "trialing";
const invoiceSubscription = (invoice: Stripe.Invoice) => idOf(invoice.parent?.subscription_details?.subscription);

export async function processBillingEvent(event: Stripe.Event, { stripe, db, prices }: Dependencies) {
  async function syncSubscription(id: string, checkoutUserId?: string) {
    const initial = await stripe.subscriptions.retrieve(id);
    const existing = await db.billingSubscription.findUnique({ where: { id } });
    const userId = existing?.userId || initial.metadata.userId || checkoutUserId;
    // A shared Stripe account can contain subscriptions from other applications.
    if (!userId) return false;
    await db.$transaction(async tx => {
      // Serialize refreshes for this account before obtaining the latest Stripe state.
      // Older/duplicate webhook deliveries therefore cannot overwrite a newer snapshot.
      await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId} FOR UPDATE`;
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("Subscription user not found");
      const subscription = await stripe.subscriptions.retrieve(id);
      const customerId = idOf(subscription.customer);
      if (!customerId || (user.stripeCustomerId && user.stripeCustomerId !== customerId)) throw new Error("Subscription customer mismatch");
      const ids = subscription.items.data.map(item => item.price.id);
      let tier: SubscriptionTier = "FREE";
      if (active(subscription.status)) {
        if (prices.ENTERPRISE && ids.includes(prices.ENTERPRISE)) tier = "ENTERPRISE";
        else if (prices.PROFESSIONAL && ids.includes(prices.PROFESSIONAL)) tier = "PROFESSIONAL";
        else throw new Error("Subscription price is not configured");
      }
      const data = { userId, customerId, status: subscription.status, tier };
      await tx.billingSubscription.upsert({ where: { id }, create: { id, ...data }, update: data });
      const subscriptions = await tx.billingSubscription.findMany({ where: { userId, status: { in: ["active", "trialing"] } } });
      const selected = subscriptions.find(item => item.tier === "ENTERPRISE") || subscriptions.find(item => item.tier === "PROFESSIONAL");
      await tx.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId, stripeSubscriptionId: selected?.id || null, subscriptionTier: selected?.tier || "FREE" } });
    }, { timeout: 20000, maxWait: 5000 });
    return true;
  }

  const type = event.type;
  if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription") return { handled: false };
    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return { handled: true };
    const id = idOf(session.subscription);
    if (!id) throw new Error("Checkout subscription missing");
    return { handled: await syncSubscription(id, session.client_reference_id || undefined) };
  }
  if (["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted", "customer.subscription.paused", "customer.subscription.resumed"].includes(type)) {
    return { handled: await syncSubscription((event.data.object as Stripe.Subscription).id) };
  }
  if (["invoice.paid", "invoice.payment_succeeded", "invoice.payment_failed", "invoice.finalization_failed"].includes(type)) {
    const invoice = event.data.object as Stripe.Invoice;
    const id = invoiceSubscription(invoice);
    if (!id) return { handled: false };
    const handled = await syncSubscription(id);
    if (handled && (type === "invoice.payment_failed" || type === "invoice.finalization_failed")) {
      const data = { type, objectId: invoice.id, subscriptionId: id };
      await db.billingIssue.upsert({ where: { id: event.id }, create: { id: event.id, ...data }, update: data });
    }
    return { handled };
  }
  if (["charge.refunded", "charge.dispute.created", "radar.early_fraud_warning.created"].includes(type)) {
    const object = event.data.object as Stripe.Charge | Stripe.Dispute | Stripe.Radar.EarlyFraudWarning;
    let paymentIntent = idOf(object.payment_intent);
    const chargeId = "charge" in object ? idOf(object.charge) : object.id;
    if (!paymentIntent && chargeId) paymentIntent = idOf((await stripe.charges.retrieve(chargeId)).payment_intent);
    const subscriptionIds = new Set<string>();
    if (paymentIntent) {
      for await (const payment of stripe.invoicePayments.list({ payment: { type: "payment_intent", payment_intent: paymentIntent }, status: "paid", limit: 100 })) {
        const invoiceId = idOf(payment.invoice);
        if (!invoiceId) continue;
        const id = invoiceSubscription(await stripe.invoices.retrieve(invoiceId));
        if (id) subscriptionIds.add(id);
      }
    }
    // Retain financial risk signals for the administrator; never silently acknowledge them.
    // Refund/cancellation decisions remain in Stripe instead of guessing a business policy.
    const data = { type, objectId: object.id, subscriptionId: [...subscriptionIds][0] || null };
    await db.billingIssue.upsert({ where: { id: event.id }, create: { id: event.id, ...data }, update: data });
    for (const id of subscriptionIds) await syncSubscription(id);
    return { handled: true };
  }
  return { handled: false };
}
