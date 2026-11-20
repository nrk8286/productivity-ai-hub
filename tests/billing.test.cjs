const test = require('node:test');
const assert = require('node:assert/strict');
const { processBillingEvent } = require('../src/lib/monetization/billing.ts');

function fixture() {
  const user = { id: 'user_local', stripeCustomerId: null, subscriptionTier: 'FREE' };
  const subscriptions = new Map(), issues = new Map();
  const current = { id: 'sub_local', customer: 'cus_local', metadata: { userId: user.id }, status: 'active', items: { data: [{ price: { id: 'price_pro' } }] } };
  let locks = 0;
  const db = {
    $queryRaw: async () => { locks++; },
    user: { findUnique: async ({ where }) => where.id === user.id ? user : null, update: async ({ data }) => Object.assign(user, data) },
    billingSubscription: {
      findUnique: async ({ where }) => subscriptions.get(where.id),
      upsert: async ({ where, create, update }) => subscriptions.set(where.id, subscriptions.has(where.id) ? { ...subscriptions.get(where.id), ...update } : create),
      findMany: async () => [...subscriptions.values()].filter(item => ['active', 'trialing'].includes(item.status)),
    },
    billingIssue: { upsert: async ({ where, create, update }) => issues.set(where.id, issues.has(where.id) ? { ...issues.get(where.id), ...update } : create) },
  };
  db.$transaction = async work => work(db);
  const stripe = {
    subscriptions: { retrieve: async () => structuredClone(current) },
    charges: { retrieve: async () => ({ payment_intent: 'pi_local' }) },
    invoicePayments: { list: async function* () { yield { invoice: 'in_local' }; } },
    invoices: { retrieve: async () => ({ parent: { type: 'subscription_details', subscription_details: { subscription: current.id } } }) },
  };
  const run = (type, object, id = 'evt_local') => processBillingEvent({ id, type, data: { object } }, { stripe, db, prices: { PROFESSIONAL: 'price_pro', ENTERPRISE: 'price_enterprise' } });
  return { user, current, issues, subscriptions, run, locks: () => locks };
}

test('paid checkout persists the subscription and duplicate deliveries are idempotent', async () => {
  const f = fixture();
  const object = { mode: 'subscription', payment_status: 'paid', subscription: f.current.id, client_reference_id: f.user.id };
  assert.deepEqual(await f.run('checkout.session.completed', object), { handled: true });
  await f.run('checkout.session.completed', object);
  assert.equal(f.subscriptions.size, 1);
  assert.equal(f.user.subscriptionTier, 'PROFESSIONAL');
  assert.equal(f.user.stripeCustomerId, 'cus_local');
  assert.equal(f.locks(), 2);
});

test('unpaid checkout never grants access and asynchronous payment can fulfill later', async () => {
  const f = fixture();
  const object = { mode: 'subscription', payment_status: 'unpaid', subscription: f.current.id, client_reference_id: f.user.id };
  await f.run('checkout.session.completed', object);
  assert.equal(f.user.subscriptionTier, 'FREE');
  assert.equal(f.subscriptions.size, 0);
  await f.run('checkout.session.async_payment_succeeded', { ...object, payment_status: 'paid' });
  assert.equal(f.user.subscriptionTier, 'PROFESSIONAL');
});

test('delayed events refresh current state instead of resurrecting a canceled plan', async () => {
  const f = fixture();
  await f.run('customer.subscription.updated', f.current);
  const oldPayload = structuredClone(f.current);
  f.current.status = 'canceled';
  await f.run('customer.subscription.updated', oldPayload);
  assert.equal(f.user.subscriptionTier, 'FREE');
  assert.equal(f.user.stripeSubscriptionId, null);
});

test('invoice failures update entitlement and create one administrator issue per event', async () => {
  const f = fixture(); f.current.status = 'past_due';
  const invoice = { id: 'in_local', parent: { type: 'subscription_details', subscription_details: { subscription: f.current.id } } };
  await f.run('invoice.payment_failed', invoice);
  await f.run('invoice.payment_failed', invoice);
  assert.equal(f.user.subscriptionTier, 'FREE');
  assert.equal(f.issues.size, 1);
  assert.equal(f.issues.get('evt_local').subscriptionId, f.current.id);
});

test('refunds, disputes and fraud warnings resolve invoice subscriptions and retain review records', async () => {
  const f = fixture();
  for (const type of ['charge.refunded', 'charge.dispute.created', 'radar.early_fraud_warning.created']) {
    await f.run(type, { id: 'object_local', charge: 'ch_local', payment_intent: null }, type);
  }
  assert.equal(f.issues.size, 3);
  assert.equal(f.subscriptions.size, 1);
});

test('unknown prices, missing users and mismatched customers fail for webhook retry', async () => {
  const f = fixture();
  f.current.items.data[0].price.id = 'price_unknown';
  await assert.rejects(f.run('customer.subscription.updated', f.current), /price/);
  f.current.items.data[0].price.id = 'price_pro';
  f.user.stripeCustomerId = 'cus_other';
  await assert.rejects(f.run('customer.subscription.updated', f.current), /customer mismatch/);
  f.user.stripeCustomerId = null;
  f.current.metadata.userId = 'missing_user';
  await assert.rejects(f.run('customer.subscription.updated', f.current), /user not found/);
});
