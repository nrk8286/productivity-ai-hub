import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Privacy Policy - How We Protect Your Data",
  description: "Learn how Productivity AI Hub collects, uses, and protects your personal information. GDPR and CCPA compliant.",
  keywords: ["privacy policy", "data protection", "GDPR", "CCPA"],
});

export default function PrivacyPage() {
  return (
    <div className="container py-24">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1>Privacy Policy</h1>
        <p className="lead">Last updated: December 24, 2025</p>

        <h2>Introduction</h2>
        <p>
          At Productivity AI Hub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
        </p>

        <h2>Information We Collect</h2>
        <h3>Information You Provide</h3>
        <ul>
          <li><strong>Account Information:</strong> Name, email address, password, and company details</li>
          <li><strong>Payment Information:</strong> Billing address and payment card details (processed securely via Stripe)</li>
          <li><strong>Content:</strong> Documents, files, and data you upload or create in our platform</li>
          <li><strong>Communications:</strong> Messages you send us via email, chat, or contact forms</li>
        </ul>

        <h3>Information We Collect Automatically</h3>
        <ul>
          <li><strong>Usage Data:</strong> Pages viewed, features used, time spent, and interaction patterns</li>
          <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
          <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide and improve our services</li>
          <li>Process payments and prevent fraud</li>
          <li>Send important updates and security alerts</li>
          <li>Provide customer support</li>
          <li>Personalize your experience with AI features</li>
          <li>Analyze usage patterns to improve our product</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>Data Sharing and Disclosure</h2>
        <p>We do not sell your personal data. We may share your information with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Third-party companies that help us operate our service (e.g., Stripe for payments, AWS for hosting)</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We implement industry-standard security measures including:
        </p>
        <ul>
          <li>AES-256 encryption for data at rest</li>
          <li>TLS 1.3 for data in transit</li>
          <li>Regular security audits and penetration testing</li>
          <li>SOC 2 Type II certification</li>
          <li>Multi-factor authentication options</li>
        </ul>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Delete your account and data</li>
          <li>Export your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Object to automated decision-making</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          We retain your data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain information for legal compliance, fraud prevention, and analytics (anonymized).
        </p>

        <h2>International Transfers</h2>
        <p>
          Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses approved by the European Commission.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through our service.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@productivity-ai-hub.com</li>
          <li>Address: [Your Business Address]</li>
        </ul>
      </div>
    </div>
  );
}
