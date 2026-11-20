# API documentation

All paths are relative to the Next.js application origin. Use HTTPS and configure the actual public URLs and provider settings described in [README.md](README.md). Application builds do not initialize or migrate the database.

## Authentication

Open `/login` for the NextAuth credentials form, or use `signIn("credentials", ...)` from `next-auth/react`. NextAuth requires its CSRF token for form callbacks; a plain JSON POST containing only an email and password is not a supported login flow. Accounts must first be provisioned with `npm run account:create`.

Authenticated requests use the NextAuth session cookie. Same-origin `fetch` includes it automatically. GET `/api/auth/session` returns session information; use the NextAuth sign-out UI at `/api/auth/signout` to end the session.

## Endpoints

| Method and path | Access | Request and behavior |
| --- | --- | --- |
| POST `/api/contact` | Public | JSON `name`, `email`, `subject`, `message`; validates size and format, stores a contact message, then returns `201 { "received": true }`. A database failure returns 503. |
| POST `/api/email/subscribe` | Public | JSON `email`, optional `name` and `source`; persists a subscriber. It does not send a welcome email. |
| POST `/api/email/send` | Administrator | JSON `to` (email or array), `subject`, `html`, optional `text` and `replyTo`; sends through configured Resend. Returns 401 without a session, 403 for a non-admin, and 503 when delivery is not configured. |
| POST `/api/analytics/track` | Public; session optional | JSON `event`, `sessionId`, optional `properties`; persists an event. Any associated user ID comes from the authenticated session, not a caller-supplied ID. |
| GET `/api/analytics/dashboard` | Administrator | Required query parameters `startDate`, `endDate`; invalid or reversed dates return 400. Returns recorded metrics or 503 if they cannot be read. |
| POST `/api/content/generate` | Authenticated | JSON `topic`, `type` (`blog`, `social`, `email`, `ad-copy`), optional `tone`, `length`, `targetAudience`; calls the configured Anthropic model. Missing key/model returns 503. |
| POST `/api/chatbot` | Public | JSON `messages` (1–25 `{ "role": "user" or "assistant", "content": "..." }` entries, at most 8,000 characters each), optional `userInfo`; calls Anthropic. Missing key/model returns 503. |
| POST `/api/payments/create-checkout` | Authenticated | JSON `planType` (`professional` or `enterprise`); returns a Stripe Checkout `url` and `sessionId`. Requires the selected price, API key, and webhook signing secret; missing configuration returns 503. |
| POST `/api/payments/portal` | Authenticated | No body needed; uses the current user's stored Stripe customer ID and returns a portal `url`. Returns 404 without a stored customer. |
| POST `/api/payments/webhook` | Stripe signature | Raw Stripe event body plus `stripe-signature`; validates the signature before updating subscription records. See event setup below. |

Example contact request:

```javascript
const response = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Example Person',
    email: 'person@example.com',
    subject: 'Product question',
    message: 'Please tell me which features are available.',
  }),
});
if (!response.ok) throw new Error('Message could not be saved');
```

Contact requests are visible to administrators on `/dashboard`. The dashboard also shows database-derived metrics and billing review events. It is not accessible anonymously.

## Billing events and failures

Configure a Stripe sandbox webhook using API version `2026-11-18.endive` and the event list in [README.md](README.md#stripe-subscriptions). The processor uses current Stripe state, per-user transaction locking, and upserts to tolerate duplicate or delayed events. Unpaid Checkout completion does not grant access. Active or trialing subscriptions with configured prices set the account tier; other statuses do not grant a paid tier.

Invalid signatures return 400. Missing webhook configuration returns 503. Database/provider failures return 500 so Stripe retries rather than treating an unprocessed event as successful. Events unrelated to the application's subscriptions may return `{ "received": true, "handled": false }`. Refunds, disputes, fraud warnings, and invoice failures produce administrator review records; they do not trigger automatic refunds or cancellations.

## Operational limits

Use a hosting-layer rate limit for public endpoints and validate the full provider flow in a sandbox before live use. This repository does not implement a universal per-user request quota. The contact endpoint and chatbot validate payload bounds, but those checks are not a replacement for request-rate controls.

There is no bulk email queue, scheduled newsletter pipeline, invoice accounting ledger, public signup UI, or self-service checkout interface. Error responses do not prove a provider or database is configured. The documented local tests use disposable data and do not certify hosted credentials, production payments, or email delivery.
