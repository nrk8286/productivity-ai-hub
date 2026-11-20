const test = require('node:test');
const assert = require('node:assert/strict');

test('webhook verification accepts an authentic raw body and rejects tampering', () => {
  const previousKey = process.env.STRIPE_SECRET_KEY;
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  process.env.STRIPE_SECRET_KEY = 'local-fixture-key-with-no-provider-access';
  process.env.STRIPE_WEBHOOK_SECRET = 'local-fixture-webhook-signing-secret';
  try {
    const Stripe = require('stripe');
    const client = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { constructWebhookEvent } = require('../src/lib/monetization/stripe.ts');
    const payload = JSON.stringify({ id: 'evt_local', type: 'checkout.session.completed', data: { object: { id: 'cs_local' } } });
    const signature = client.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK_SECRET });
    assert.equal(constructWebhookEvent(payload, signature).id, 'evt_local');
    assert.equal(constructWebhookEvent(payload + ' ', signature), null);
    assert.equal(constructWebhookEvent(payload, 'invalid'), null);
  } finally {
    if (previousKey === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = previousKey;
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }
});
