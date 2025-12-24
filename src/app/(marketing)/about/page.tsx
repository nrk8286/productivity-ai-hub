import { generateSEO } from "@/lib/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Heart, Award } from "lucide-react";

export const metadata = generateSEO({
  title: "About Us - Building Tools for the Future of Work",
  description: "Learn about our mission to empower remote teams with AI-powered productivity tools. Our story, values, and the team behind Productivity AI Hub.",
  keywords: ["about us", "company", "mission", "remote work"],
});

export default function AboutPage() {
  return (
    <div className="container py-24">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Building the Future of Remote Work
          </h1>
          <p className="text-lg text-muted-foreground">
            We're on a mission to make distributed teams more productive, connected, and successful.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Our Story</h2>
          <p>
            Productivity AI Hub was born from a simple frustration: remote work tools weren't keeping up with how teams actually work. We spent too much time switching between apps, searching for information, and doing repetitive tasks that should be automated.
          </p>
          <p>
            In 2023, our founders (who had been working remotely for years) decided to build something better. We combined AI automation, intelligent workflows, and beautiful design to create tools that actually help teams get work done.
          </p>
          <p>
            Today, we serve over 10,000 teams across 50 countries, from startups to Fortune 500 companies. But we're just getting started.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Remote-First</h3>
              <p className="text-muted-foreground">
                We're a distributed team across 15 countries. We practice what we preach and build tools we use ourselves.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Customer-Focused</h3>
              <p className="text-muted-foreground">
                Every feature we build starts with a customer problem. We ship updates weekly based on your feedback.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">People-Centric</h3>
              <p className="text-muted-foreground">
                Technology should serve people, not the other way around. We design for humans, not just efficiency metrics.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Excellence Driven</h3>
              <p className="text-muted-foreground">
                We hold ourselves to the highest standards. Every pixel, every feature, every interaction matters.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-muted-foreground mb-4">
            We're always looking for talented, passionate people to join our team. Check out our open positions or reach out if you think you'd be a great fit.
          </p>
          <a href="/contact" className="text-primary hover:underline font-semibold">
            Get in touch →
          </a>
        </div>
      </div>
    </div>
  );
}
