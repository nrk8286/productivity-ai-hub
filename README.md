# Productivity AI Hub 🚀

> AI-powered marketing website for remote team productivity tools - Complete with monetization, automation, and analytics

A fully-functional, production-ready Next.js 14 application featuring AI-powered content generation, Stripe payments, email automation, and comprehensive analytics.

## ✨ Features

### 🎯 Marketing & Content
- **50+ SEO-optimized blog posts** with AI-generated content
- **Tools directory** with affiliate links and reviews
- **Free templates** for productivity and workflow optimization
- **Dynamic pricing pages** with interactive features
- **Newsletter subscription** with automated sequences
- **Contact forms** with validation and email integration

### 🤖 AI-Powered Features
- **AI Content Generator** using Claude 3.5 Sonnet
- **Intelligent Chatbot** for customer support
- **Automated Blog Post Generation** script
- **Smart Personalization** based on user behavior

### 💳 Monetization
- **Stripe Integration** for subscriptions and one-time payments
- **Three-tier pricing** (Free, Professional, Enterprise)
- **Customer Portal** for subscription management
- **Webhook handling** for payment events
- **Affiliate product tracking**

### 📊 Analytics & Tracking
- **Custom Analytics** with Prisma database
- **Event Tracking** (page views, clicks, conversions)
- **Revenue Dashboard** with key metrics
- **User behavior tracking**

### 🔐 Authentication & Security
- **NextAuth.js** integration
- **Role-based access control** (User, Admin)
- **Secure password hashing**
- **Protected API routes**

### 📧 Email Automation
- **Resend** integration for transactional emails
- **Welcome email** sequence
- **Onboarding** drip campaign (3 emails)
- **Cart abandonment** recovery
- **Newsletter** distribution

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Email:** Resend
- **AI:** Anthropic Claude API
- **Deployment:** Vercel-ready

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Stripe account
- Resend account
- Anthropic API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nrk8286/productivity-ai-hub.git
   cd productivity-ai-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/productivity_hub"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   
   # Resend
   RESEND_API_KEY="re_..."
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   
   # Anthropic
   ANTHROPIC_API_KEY="sk-ant-..."
   
   # App Config
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_NAME="Productivity AI Hub"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Generate blog content** (Optional)
   ```bash
   npm run generate-content
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run generate-content` - Generate 50 blog posts

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step deployment instructions
- [Monetization Strategy](./MONETIZATION.md) - Revenue generation guide
- [Content Strategy](./CONTENT_STRATEGY.md) - SEO and content marketing
- [API Documentation](./API_DOCUMENTATION.md) - API endpoints reference

## 🏗️ Project Structure

```
productivity-ai-hub/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (marketing)/        # Marketing pages
│   │   │   ├── blog/           # Blog listing and posts
│   │   │   ├── tools/          # Tools directory
│   │   │   ├── pricing/        # Pricing page
│   │   │   └── ...
│   │   ├── (dashboard)/        # Protected dashboard
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication
│   │   │   ├── payments/       # Stripe integration
│   │   │   ├── email/          # Email sending
│   │   │   └── ...
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── marketing/          # Marketing components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── automation/         # Automation components
│   │   └── analytics/          # Analytics components
│   └── lib/
│       ├── ai/                 # AI integrations
│       ├── analytics/          # Analytics tracking
│       ├── email/              # Email functions
│       ├── monetization/       # Payment processing
│       ├── auth.ts             # Auth configuration
│       ├── db.ts               # Database client
│       └── utils.ts            # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
├── content/
│   └── blog-posts.json         # Generated blog content
├── scripts/
│   └── generate-content.ts     # Content generation
├── public/                     # Static assets
└── ...config files

```

## 🔑 Key Features Implementation

### AI Content Generation
```typescript
import { generateContent } from '@/lib/ai/content-generator';

const result = await generateContent({
  topic: "AI Productivity Tools",
  type: "blog",
  tone: "professional",
  length: "long",
});
```

### Stripe Payments
```typescript
import { createCheckoutSession } from '@/lib/monetization/stripe';

const { session } = await createCheckoutSession({
  priceId: "price_xxx",
  userId: user.id,
  userEmail: user.email,
  successUrl: "/success",
  cancelUrl: "/cancel",
});
```

### Email Automation
```typescript
import { sendWelcomeEmail } from '@/lib/email/send';

await sendWelcomeEmail(user.email, user.name);
```

### Analytics Tracking
```typescript
import { trackEvent } from '@/lib/analytics/tracking';

await trackEvent({
  event: "button_click",
  properties: { buttonId: "cta-signup" },
  sessionId: sessionId,
  userId: user?.id,
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Stripe](https://stripe.com/)
- [Anthropic](https://anthropic.com/)
- [Resend](https://resend.com/)

## 💬 Support

Need help? Check out our:
- [Documentation](./API_DOCUMENTATION.md)
- [Issues](https://github.com/nrk8286/productivity-ai-hub/issues)
- [Discussions](https://github.com/nrk8286/productivity-ai-hub/discussions)

---

Built with ❤️ for remote teams worldwide
