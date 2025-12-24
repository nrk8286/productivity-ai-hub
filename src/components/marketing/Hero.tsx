import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="container flex flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Supercharge Your Remote Team
          <span className="block text-primary">with AI Automation</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          Discover cutting-edge AI tools, productivity templates, and automation workflows
          designed specifically for distributed teams. Boost efficiency by 10x.
        </p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row animate-fade-in">
        <Link href="/tools">
          <Button size="lg" className="gap-2">
            Explore AI Tools <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/blog">
          <Button size="lg" variant="outline">
            Read Our Blog
          </Button>
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row animate-fade-in">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-background"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            Trusted by 10,000+ remote teams
          </span>
        </div>
      </div>
    </section>
  );
}
