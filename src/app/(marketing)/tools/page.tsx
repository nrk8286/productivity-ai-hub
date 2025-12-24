import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateSEO } from "@/lib/seo";
import { ExternalLink, Star } from "lucide-react";

export const metadata = generateSEO({
  title: "AI Tools Directory - Best Productivity Tools for Remote Teams",
  description: "Discover curated AI-powered productivity tools, automation platforms, and collaboration software. Expert reviews, pricing comparisons, and integration guides.",
  keywords: ["AI tools", "productivity software", "automation tools", "remote work tools", "collaboration platforms"],
});

const tools = [
  {
    name: "Notion AI",
    description: "AI-powered workspace that combines notes, docs, wikis, and project management in one place.",
    category: "Knowledge Management",
    rating: 4.8,
    price: "$10/mo",
    affiliateUrl: "https://notion.so",
    features: ["AI writing assistant", "Database management", "Team collaboration"],
  },
  {
    name: "Zapier",
    description: "Connect your apps and automate workflows. No code required for powerful automation.",
    category: "Automation",
    rating: 4.7,
    price: "$19/mo",
    affiliateUrl: "https://zapier.com",
    features: ["5000+ integrations", "Multi-step workflows", "Custom logic"],
  },
  {
    name: "Grammarly",
    description: "AI-powered writing assistant that helps you write clearly and effectively.",
    category: "Writing",
    rating: 4.6,
    price: "$12/mo",
    affiliateUrl: "https://grammarly.com",
    features: ["Grammar checking", "Tone detection", "Plagiarism checker"],
  },
  {
    name: "Clockify",
    description: "Free time tracking software for teams. Track work hours across projects and teams.",
    category: "Time Tracking",
    rating: 4.7,
    price: "Free",
    affiliateUrl: "https://clockify.me",
    features: ["Unlimited tracking", "Reports", "Team management"],
  },
  {
    name: "Loom",
    description: "Record quick videos of your screen and camera. Perfect for async communication.",
    category: "Communication",
    rating: 4.8,
    price: "$8/mo",
    affiliateUrl: "https://loom.com",
    features: ["Screen recording", "Video messages", "Team library"],
  },
  {
    name: "Figma",
    description: "Collaborative interface design tool. Design, prototype, and gather feedback in one place.",
    category: "Design",
    rating: 4.9,
    price: "$12/mo",
    affiliateUrl: "https://figma.com",
    features: ["Real-time collaboration", "Prototyping", "Design systems"],
  },
];

export default function ToolsPage() {
  return (
    <div className="container py-24">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          AI Tools Directory
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Handpicked productivity tools that our team uses and recommends. Each tool is tested and reviewed for remote teams.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{tool.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {tool.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="text-sm font-semibold">{tool.rating}</span>
                </div>
              </div>
              <CardDescription className="mt-2">{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Key Features:</p>
                  <ul className="space-y-1">
                    {tool.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-lg font-bold">{tool.price}</span>
                  <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      Learn More <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
