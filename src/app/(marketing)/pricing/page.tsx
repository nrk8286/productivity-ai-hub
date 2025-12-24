import PricingCards from "@/components/marketing/PricingCards";
import FAQ from "@/components/marketing/FAQ";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Pricing - Affordable Plans for Every Team Size",
  description: "Choose the perfect plan for your team. From free starter plans to enterprise solutions with custom AI models. 30-day money-back guarantee.",
  keywords: ["pricing", "plans", "subscription", "team collaboration pricing"],
});

export default function PricingPage() {
  return (
    <>
      <PricingCards />
      <FAQ />
    </>
  );
}
