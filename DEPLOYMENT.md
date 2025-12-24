# Deployment Guide

## Deploying to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy your Next.js application.

### Prerequisites

- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (we recommend [Neon](https://neon.tech/) or [Supabase](https://supabase.com/))

### Step 1: Prepare Your Database

1. **Create a PostgreSQL database**
   - Option A: [Neon](https://neon.tech/) - Serverless PostgreSQL
   - Option B: [Supabase](https://supabase.com/) - Open-source Firebase alternative
   - Option C: [Railway](https://railway.app/) - Simple deployment platform

2. **Get your connection string**
   - It should look like: `postgresql://user:password@host:5432/database`

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `productivity-ai-hub` repository

### Step 4: Configure Environment Variables

Add these environment variables in the Vercel dashboard:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_a_random_32_char_string

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PROFESSIONAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Productivity AI Hub
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

### Step 6: Set Up Database Schema

After first deployment, run database migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run Prisma commands
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### Step 7: Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/payments/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook secret and add it to Vercel environment variables

### Step 8: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Alternative: Deploy to Railway

### Prerequisites
- Railway account
- GitHub repository

### Steps

1. **Go to [railway.app](https://railway.app)**
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your repository**
4. **Add environment variables** (same as Vercel)
5. **Click "Deploy"**

Railway will automatically:
- Build your application
- Provision a PostgreSQL database
- Set up SSL certificates

## Alternative: Self-Hosting with Docker

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      # ... other env vars
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: productivity_hub
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Deploy

```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Test Stripe checkout (use test mode first)
- [ ] Verify email sending works
- [ ] Test AI content generation
- [ ] Check analytics tracking
- [ ] Set up monitoring (Vercel Analytics or similar)
- [ ] Configure error tracking (Sentry recommended)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit
- [ ] Set up automated backups for database

## Monitoring & Maintenance

### Recommended Services

- **Monitoring:** Vercel Analytics, Google Analytics
- **Error Tracking:** [Sentry](https://sentry.io/)
- **Uptime Monitoring:** [UptimeRobot](https://uptimerobot.com/)
- **Performance:** [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Backup Strategy

Set up automated database backups:
- Daily backups with 30-day retention
- Weekly backups with 3-month retention
- Monthly backups with 1-year retention

## Troubleshooting

### Build Errors

**Error: "Cannot find module '@prisma/client'"**
```bash
npx prisma generate
npm run build
```

**Error: "Database connection failed"**
- Verify DATABASE_URL is correct
- Check if database is accessible from Vercel
- Ensure IP is whitelisted (for some database providers)

### Runtime Errors

**Error: "NEXTAUTH_SECRET is not defined"**
- Add NEXTAUTH_SECRET environment variable
- Generate a secure random string: `openssl rand -base64 32`

**Error: "Stripe webhook signature verification failed"**
- Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
- Ensure webhook endpoint URL is correct

## Scaling Considerations

As your traffic grows:

1. **Upgrade Database:** Move to larger instance
2. **Enable Caching:** Add Redis for session storage
3. **CDN:** Use Vercel's built-in CDN or Cloudflare
4. **Database Connection Pooling:** Use PgBouncer
5. **Rate Limiting:** Add rate limiting to API routes

## Security Best Practices

- [ ] Use environment variables for all secrets
- [ ] Enable Vercel's Security Headers
- [ ] Set up CORS properly
- [ ] Use Content Security Policy
- [ ] Enable HTTPS only (forced redirect)
- [ ] Regularly update dependencies
- [ ] Use Dependabot for security alerts
- [ ] Implement rate limiting on API routes

## Support

Need help with deployment?
- Check [Vercel Documentation](https://vercel.com/docs)
- Visit our [GitHub Discussions](https://github.com/nrk8286/productivity-ai-hub/discussions)
- Create an [Issue](https://github.com/nrk8286/productivity-ai-hub/issues)
