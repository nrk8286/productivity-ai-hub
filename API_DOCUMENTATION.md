# API Documentation

## Base URL

**Development:** `http://localhost:3000/api`  
**Production:** `https://your-domain.com/api`

## Authentication

Most API endpoints require authentication using NextAuth.js session cookies.

```typescript
// Example authenticated request
const response = await fetch('/api/protected-route', {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important: include cookies
});
```

## API Endpoints

### Authentication

#### POST `/api/auth/callback/credentials`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "clxxx",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

### Payments (Stripe)

#### POST `/api/payments/create-checkout`
Create a Stripe checkout session for subscription.

**Auth:** Required

**Request:**
```json
{
  "planType": "professional" // or "enterprise"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/..."
}
```

**Errors:**
- `401` - Unauthorized
- `400` - Invalid plan type
- `500` - Failed to create session

---

#### POST `/api/payments/webhook`
Webhook endpoint for Stripe events.

**Auth:** Stripe signature verification

**Headers:**
```
stripe-signature: xxx
```

**Handled Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

---

#### POST `/api/payments/portal`
Create a Stripe customer portal session.

**Auth:** Required

**Response:**
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

---

### Email

#### POST `/api/email/send`
Send a transactional email.

**Request:**
```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "html": "<h1>Welcome to our platform</h1>",
  "text": "Welcome to our platform", // optional
  "replyTo": "support@example.com" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "xxx"
  }
}
```

---

#### POST `/api/email/subscribe`
Subscribe to newsletter.

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe", // optional
  "source": "landing-page", // optional
  "tags": ["newsletter", "blog"] // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

---

### Analytics

#### POST `/api/analytics/track`
Track an analytics event.

**Request:**
```json
{
  "event": "button_click",
  "properties": {
    "buttonId": "cta-signup",
    "page": "/pricing"
  },
  "sessionId": "session_xxx",
  "userId": "user_xxx" // optional
}
```

**Response:**
```json
{
  "success": true
}
```

**Common Events:**
- `page_view`
- `button_click`
- `form_submission`
- `signup`
- `purchase`

---

#### GET `/api/analytics/dashboard`
Get dashboard metrics.

**Auth:** Required (Admin only)

**Query Parameters:**
- `startDate` (ISO 8601 date string)
- `endDate` (ISO 8601 date string)

**Example:**
```
GET /api/analytics/dashboard?startDate=2025-01-01&endDate=2025-01-31
```

**Response:**
```json
{
  "metrics": {
    "pageViews": 15420,
    "uniqueVisitors": 3240,
    "signups": 87,
    "purchases": 12,
    "revenue": 348.00,
    "conversionRate": 0.37
  }
}
```

---

### AI Features

#### POST `/api/content/generate`
Generate AI content.

**Auth:** Required

**Request:**
```json
{
  "topic": "Productivity Tips for Remote Teams",
  "type": "blog", // "blog" | "social" | "email" | "ad-copy"
  "tone": "professional", // optional
  "length": "medium", // optional: "short" | "medium" | "long"
  "targetAudience": "remote workers" // optional
}
```

**Response:**
```json
{
  "content": "<h2>Introduction</h2><p>...</p>",
  "usage": {
    "input_tokens": 245,
    "output_tokens": 1823
  }
}
```

---

#### POST `/api/chatbot`
Chat with AI assistant.

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "How can I improve team productivity?"
    }
  ],
  "userInfo": { // optional
    "subscriptionTier": "professional",
    "interests": ["automation", "remote-work"]
  }
}
```

**Response:**
```json
{
  "message": "Here are some strategies to improve team productivity...",
  "usage": {
    "input_tokens": 123,
    "output_tokens": 456
  }
}
```

---

## Error Responses

All endpoints follow a consistent error format:

```json
{
  "error": "Error message here",
  "details": {} // optional, for validation errors
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Rate Limiting

- **Anonymous requests:** 100 requests per 15 minutes
- **Authenticated requests:** 1000 requests per 15 minutes
- **AI endpoints:** 50 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Webhooks

### Stripe Webhooks

Configure in Stripe Dashboard:
- URL: `https://your-domain.com/api/payments/webhook`
- Events: All payment-related events

### Security

All webhooks are verified using signature verification. Invalid signatures are rejected with `400 Bad Request`.

---

## SDKs and Libraries

### TypeScript/JavaScript

```typescript
// Example client wrapper
class ProductivityAIClient {
  constructor(private baseUrl: string) {}

  async trackEvent(event: string, properties: any) {
    return fetch(`${this.baseUrl}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, properties }),
      credentials: 'include',
    });
  }

  async generateContent(options: GenerateContentOptions) {
    return fetch(`${this.baseUrl}/api/content/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
      credentials: 'include',
    });
  }
}
```

---

## Best Practices

1. **Always include proper error handling**
```typescript
try {
  const response = await fetch('/api/endpoint');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('API error:', error);
}
```

2. **Use TypeScript for type safety**
```typescript
interface TrackEventRequest {
  event: string;
  properties?: Record<string, any>;
  sessionId: string;
  userId?: string;
}
```

3. **Implement retries for transient failures**
```typescript
async function fetchWithRetry(url: string, options: any, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## Support

For API support:
- Email: api-support@productivity-ai-hub.com
- GitHub Issues: https://github.com/nrk8286/productivity-ai-hub/issues
- Documentation: https://docs.productivity-ai-hub.com
