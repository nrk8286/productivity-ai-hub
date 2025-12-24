import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Users, BarChart, Shield, Clock, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description: "Automate repetitive tasks with intelligent AI workflows that learn from your team's patterns.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Built for remote teams with real-time sync, shared workspaces, and seamless communication.",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Track productivity metrics, identify bottlenecks, and optimize your workflows with data-driven insights.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and granular access controls keep your data safe.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Automatic time tracking with AI-powered project categorization and billable hours reporting.",
  },
  {
    icon: Sparkles,
    title: "Smart Integrations",
    description: "Connect with 100+ tools including Slack, GitHub, Notion, and more with one-click setup.",
  },
];

export default function Features() {
  return (
    <section className="container py-24">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Everything You Need to Scale
        </h2>
        <p className="mx-auto max-w-[700px] text-muted-foreground">
          Powerful features designed for modern remote teams who demand excellence.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
