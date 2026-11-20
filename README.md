# Productivity AI Hub

A Next.js 15 marketing site with PostgreSQL/Prisma persistence, credentials-based accounts, an administrator dashboard, contact submissions, and server integrations for Stripe, Resend, and Anthropic. Provider configuration and database schema setup are required before these integrations can run on a hosted deployment.

## Local setup

Use Node.js 22 or 24 and a disposable PostgreSQL database for development.

```powershell
npm ci
Copy-Item .env.example .env
```

Set `DATABASE_URL`, a random `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and `NEXT_PUBLIC_APP_URL` in the ignored `.env`. Both URLs must identify the origin users actually visit. Generate a secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Example values are placeholders, not working credentials.

```powershell
npx prisma generate
npm run db:push
npm run dev
```

`db:push` changes the selected database schema. Use it on a new local database. Review and apply a proper migration against an existing hosted database; application builds never run schema changes automatically. The schema now includes contact messages, billing subscription snapshots, and billing review records.

Accounts are provisioned explicitly; there is no public signup UI. With `DATABASE_URL` set in the process environment, set `ACCOUNT_EMAIL`, `ACCOUNT_PASSWORD` (12+ characters, at most 72 UTF-8 bytes), and optionally `ACCOUNT_ROLE=ADMIN`, then run `npm run account:create`. The command creates one account and never overwrites existing users. Remove the password from the process environment afterward. Sign in at `/login`; NextAuth supplies the credentials form and CSRF handling.

## Connected flows

- `/contact` POSTs to `/api/contact`. Success appears only after PostgreSQL saves the message. Administrators see the latest 20 messages on `/dashboard`; ordinary accounts cannot see them. Contact submission saves a message and does not send email.
- `/dashboard` requires a session. Administrators see database-derived analytics, contact messages, and billing issues. Other users see their account and current subscription tier. Database outages show an error instead of sample or zero-valued metrics.
- `/api/email/send` requires an administrator session. `RESEND_API_KEY` and a verified `RESEND_FROM_EMAIL` are required. Newsletter signup persists subscriber records; scheduled welcome/drip delivery is not implemented.
- `/api/chatbot` and `/api/content/generate` require `ANTHROPIC_API_KEY` and `ANTHROPIC_MODEL`. Choose a supported model available to your account. The previous hardcoded Claude Sonnet 3.5 model was retired; see [Anthropic's model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations). Content generation also requires a session. The content-generation script is an explicit, potentially billable operation.
- `/api/analytics/dashboard` requires an administrator session and valid `startDate`/`endDate` query parameters. Its revenue metric counts completed `Order` rows; it is not a Stripe revenue reconciliation report.
- `/sitemap.xml` serves the existing public sitemap. Set its URLs to your actual domain before publishing.

The marketing pages describe proposed team/storage features that this repository does not implement. Pricing calls to action lead to contact requests; there is no self-service signup or checkout interface. Do not represent those product features as tested backend capabilities.

## Stripe subscriptions

Use separate Stripe sandboxes for development and CI. Store provider keys in the hosting platform's secret manager, and prefer a restricted Stripe API key with only the required permissions. Configure:

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PROFESSIONAL_PRICE_ID`, `STRIPE_ENTERPRISE_PRICE_ID` from the correct sandbox/account
- `NEXT_PUBLIC_APP_URL` for Checkout and portal return URLs

The SDK is Stripe 23.2, whose default API version is `2026-11-18.endive`. Configure the webhook destination for that version. Signed webhook bodies must reach `/api/payments/webhook` unchanged. Enable the events the processor handles:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
customer.subscription.paused
customer.subscription.resumed
invoice.paid
invoice.payment_failed
invoice.finalization_failed
charge.refunded
charge.dispute.created
radar.early_fraud_warning.created
```

Authenticated clients can POST `{ "planType": "professional" }` or `enterprise` to `/api/payments/create-checkout`. Checkout attaches the application user ID to the subscription metadata and reuses an existing Stripe customer. Duplicate requests for the same user/price share a five-minute idempotency window. Accounts with an active stored subscription must use `/api/payments/portal` to manage it. These endpoints return URLs for the client to open.

The webhook processor retrieves the current subscription inside a database transaction serialized per user. It persists the customer/subscription association and derives the account tier from active or trialing subscriptions. Incomplete, past-due, unpaid, paused, and canceled subscriptions do not grant a paid tier. Duplicate and delayed events refresh current state; database or provider errors fail the webhook so Stripe can retry. An unpaid Checkout completion does not fulfill an account.

Invoice failures, refunds, disputes, and fraud warnings create administrator review records. Review those records and the corresponding events in Stripe. The app does not automatically refund payments or cancel subscriptions based on a risk event. It does not mirror Stripe customer contact details or build an invoice accounting ledger. Evaluate Stripe Tax and required registrations before charging customers; tax collection is not enabled by this code.

Local tests use Stripe API fixtures and a disposable database. A real sandbox Checkout → webhook → account-tier → portal flow must pass before enabling live billing. No production payment was created during maintenance.

## Deployment and verification

Set environment variables directly for each Vercel environment. The old `@secret` indirections and invalid wildcard credential-CORS configuration were removed. Preview deployments need separate databases and sandbox keys. Leave `ALLOWED_ORIGINS` blank for this same-origin application; if a separate frontend is required, use one exact HTTP(S) origin without a path or trailing slash.

```powershell
npm test
npm run lint
npm run build
```

CI runs the billing/CORS regression tests, lint, and a production build without connecting to a database or provider. Local browser verification additionally exercised contact persistence, administrator/member isolation, authentication, missing-provider errors, and Prisma subscription updates against a disposable PostgreSQL-compatible PGlite database. That does not certify a hosted PostgreSQL server or provider credentials.

The dependency audit still reports transitive and major-version advisories after compatible updates. Resolve and retest those upgrades before treating the application as production-ready. Missing hosted environment variables, database migrations, provider setup, and domain configuration remain deployment requirements.
