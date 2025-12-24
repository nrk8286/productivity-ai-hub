import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not defined");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@productivity-ai-hub.com";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Welcome to Productivity AI Hub!",
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>We're thrilled to have you join Productivity AI Hub. Get ready to supercharge your team's productivity with AI-powered automation.</p>
      <h2>Here's what you can do next:</h2>
      <ul>
        <li>Complete your profile setup</li>
        <li>Explore our AI tools directory</li>
        <li>Download free productivity templates</li>
        <li>Read our latest blog posts</li>
      </ul>
      <p>Need help getting started? Just reply to this email - we're here to help!</p>
      <p>Best regards,<br>The Productivity AI Hub Team</p>
    `,
  });
}

export async function sendOnboardingEmail(email: string, name: string, step: number) {
  const steps = [
    {
      subject: "Quick Win: Set Up Your First Automation",
      content: `
        <h1>Hi ${name},</h1>
        <p>Ready for a quick productivity win? Let's set up your first automation in under 5 minutes.</p>
        <h2>Follow these steps:</h2>
        <ol>
          <li>Choose a repetitive task you do weekly</li>
          <li>Use our automation wizard to create a workflow</li>
          <li>Test it once to make sure it works</li>
          <li>Let it run automatically from now on</li>
        </ol>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/automations">Create Your First Automation →</a></p>
      `,
    },
    {
      subject: "Pro Tip: Leverage AI for Meeting Notes",
      content: `
        <h1>Hi ${name},</h1>
        <p>Did you know our AI can automatically summarize your meetings? No more manual note-taking!</p>
        <p>Here's how to enable it:</p>
        <ol>
          <li>Connect your calendar</li>
          <li>Enable AI meeting assistant</li>
          <li>Get automatic summaries after every meeting</li>
        </ol>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/integrations">Set It Up Now →</a></p>
      `,
    },
    {
      subject: "Unlock Your Team's Full Potential",
      content: `
        <h1>Hi ${name},</h1>
        <p>You've been with us for a week now. Ready to take it to the next level?</p>
        <h2>Advanced Features to Explore:</h2>
        <ul>
          <li>Custom AI workflows tailored to your team</li>
          <li>Advanced analytics and insights</li>
          <li>Team collaboration features</li>
          <li>API access for custom integrations</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing">Upgrade to Pro →</a></p>
      `,
    },
  ];

  const emailData = steps[step - 1];
  if (!emailData) return { success: false, error: "Invalid step" };

  return sendEmail({
    to: email,
    subject: emailData.subject,
    html: emailData.content,
  });
}

export async function sendCartAbandonmentEmail(email: string, name: string, planName: string) {
  return sendEmail({
    to: email,
    subject: "Complete Your Upgrade to Unlock Premium Features",
    html: `
      <h1>Hi ${name},</h1>
      <p>We noticed you were interested in upgrading to our ${planName} plan. Good news - we're holding your spot!</p>
      <h2>With ${planName}, you get:</h2>
      <ul>
        <li>Unlimited AI-powered automations</li>
        <li>Advanced team analytics</li>
        <li>Priority support</li>
        <li>Custom integrations</li>
      </ul>
      <p><strong>Special offer: Use code COMPLETE20 for 20% off your first month!</strong></p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing">Complete Your Upgrade →</a></p>
      <p>This offer expires in 48 hours.</p>
    `,
  });
}

export async function sendNewsletterEmail(
  email: string,
  subject: string,
  content: string
) {
  return sendEmail({
    to: email,
    subject,
    html: content,
  });
}
