import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";
import { FileText, Download } from "lucide-react";

export const metadata = generateSEO({
  title: "Free Templates - Productivity Templates for Remote Teams",
  description: "Download free templates for workflow automation, project management, onboarding, and more. Tested by thousands of remote teams.",
  keywords: ["productivity templates", "workflow templates", "project management templates", "remote work templates"],
});

const templates = [
  {
    title: "Remote Team Onboarding Checklist",
    description: "Complete checklist for onboarding new remote team members. Includes equipment setup, tool access, and first-week tasks.",
    category: "Onboarding",
    format: "Notion Template",
    downloads: 1240,
  },
  {
    title: "Sprint Planning Template",
    description: "Agile sprint planning template with backlog grooming, capacity planning, and velocity tracking.",
    category: "Project Management",
    format: "Google Sheets",
    downloads: 2150,
  },
  {
    title: "Weekly Async Standup",
    description: "Replace daily standups with this async template. Track progress, blockers, and goals without meetings.",
    category: "Communication",
    format: "Slack Template",
    downloads: 980,
  },
  {
    title: "OKR Tracking Dashboard",
    description: "Objectives and Key Results tracking template with automated progress updates and quarterly reviews.",
    category: "Goal Setting",
    format: "Notion Template",
    downloads: 1560,
  },
  {
    title: "Content Calendar",
    description: "Plan, schedule, and track content across multiple channels. Includes SEO checklist and performance tracking.",
    category: "Marketing",
    format: "Airtable",
    downloads: 1890,
  },
  {
    title: "1:1 Meeting Template",
    description: "Structured template for effective one-on-one meetings. Includes agenda, action items, and feedback sections.",
    category: "Management",
    format: "Google Docs",
    downloads: 2340,
  },
];

export default function TemplatesPage() {
  return (
    <div className="container py-24">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Free Productivity Templates
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Save hours with our battle-tested templates. Used by 10,000+ remote teams worldwide.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-primary" />
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <CardTitle className="mt-4">{template.title}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{template.format}</span>
                  <span className="text-muted-foreground">
                    {template.downloads.toLocaleString()} downloads
                  </span>
                </div>
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-2">Need a Custom Template?</h3>
            <p className="text-muted-foreground mb-4">
              We can create custom templates tailored to your team's specific workflow.
            </p>
            <Button>Contact Us</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
