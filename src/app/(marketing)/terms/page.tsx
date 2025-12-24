import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Terms of Service - User Agreement",
  description: "Terms and conditions for using Productivity AI Hub. Read our service agreement, acceptable use policy, and legal terms.",
  keywords: ["terms of service", "user agreement", "legal", "terms and conditions"],
});

export default function TermsPage() {
  return (
    <div className="container py-24">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1>Terms of Service</h1>
        <p className="lead">Last updated: December 24, 2025</p>

        <h2>Agreement to Terms</h2>
        <p>
          By accessing or using Productivity AI Hub ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
        </p>

        <h2>Description of Service</h2>
        <p>
          Productivity AI Hub provides AI-powered productivity tools, workflow automation, and collaboration features for remote teams. The Service includes web applications, APIs, and related services.
        </p>

        <h2>User Accounts</h2>
        <h3>Account Creation</h3>
        <ul>
          <li>You must provide accurate and complete information when creating an account</li>
          <li>You are responsible for maintaining the security of your account</li>
          <li>You must be at least 18 years old to create an account</li>
          <li>One person or legal entity may not maintain more than one free account</li>
        </ul>

        <h3>Account Responsibilities</h3>
        <ul>
          <li>You are responsible for all activity under your account</li>
          <li>You must notify us immediately of any unauthorized access</li>
          <li>You may not share your account credentials</li>
        </ul>

        <h2>Acceptable Use Policy</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Upload malicious code or viruses</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use the Service to spam or harass others</li>
          <li>Reverse engineer or decompile our software</li>
          <li>Scrape or mine data without permission</li>
          <li>Resell or redistribute the Service</li>
        </ul>

        <h2>Intellectual Property</h2>
        <h3>Your Content</h3>
        <p>
          You retain all rights to content you upload to the Service. By uploading content, you grant us a license to use, store, and process your content solely to provide the Service.
        </p>

        <h3>Our Property</h3>
        <p>
          The Service, including all software, designs, text, graphics, and other content, is owned by Productivity AI Hub and protected by copyright, trademark, and other intellectual property laws.
        </p>

        <h2>Payments and Billing</h2>
        <h3>Subscription Plans</h3>
        <ul>
          <li>Subscriptions are billed in advance on a monthly or annual basis</li>
          <li>All fees are non-refundable except as required by law or stated in our refund policy</li>
          <li>We may change prices with 30 days notice</li>
          <li>Failed payments may result in service suspension</li>
        </ul>

        <h3>Free Trial</h3>
        <ul>
          <li>Free trials are offered at our discretion</li>
          <li>We may require payment information to start a trial</li>
          <li>You will be charged when the trial ends unless you cancel</li>
        </ul>

        <h2>Cancellation and Termination</h2>
        <h3>By You</h3>
        <ul>
          <li>You may cancel your subscription at any time</li>
          <li>Cancellation takes effect at the end of your current billing period</li>
          <li>You can download your data before cancellation</li>
        </ul>

        <h3>By Us</h3>
        <p>
          We may suspend or terminate your account if you violate these Terms, fail to pay, or for any other reason at our discretion. We will provide notice when possible.
        </p>

        <h2>Warranties and Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not warrant that the Service will be uninterrupted, secure, or error-free.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
        </p>

        <h2>Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Productivity AI Hub from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
        </p>

        <h2>Dispute Resolution</h2>
        <p>
          Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You waive your right to a jury trial.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>

        <h2>Contact Information</h2>
        <p>
          Questions about these Terms? Contact us at:
        </p>
        <ul>
          <li>Email: legal@productivity-ai-hub.com</li>
          <li>Address: [Your Business Address]</li>
        </ul>
      </div>
    </div>
  );
}
