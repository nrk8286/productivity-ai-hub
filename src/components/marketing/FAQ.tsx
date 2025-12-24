import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the AI automation work?",
    answer: "Our AI analyzes your team's workflow patterns and automatically suggests optimizations. It can handle repetitive tasks like data entry, scheduling, and report generation, learning from your preferences over time.",
  },
  {
    question: "Can I integrate with my existing tools?",
    answer: "Yes! We support over 100 integrations including Slack, GitHub, Jira, Notion, Google Workspace, and Microsoft 365. New integrations are added monthly based on user requests.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use bank-level AES-256 encryption, are SOC 2 Type II certified, and comply with GDPR, CCPA, and other privacy regulations. Your data is never shared with third parties.",
  },
  {
    question: "What happens if I exceed my plan limits?",
    answer: "You'll receive a notification when you're approaching your limits. You can upgrade anytime, or we'll temporarily scale your access while you decide. We never suddenly cut off your service.",
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact support for a full refund, no questions asked.",
  },
  {
    question: "How long does setup take?",
    answer: "Most teams are up and running in under 30 minutes. Our onboarding wizard guides you through connecting your tools and setting up your first workflows.",
  },
];

export default function FAQ() {
  return (
    <section className="container py-24">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Got questions? We've got answers.
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
