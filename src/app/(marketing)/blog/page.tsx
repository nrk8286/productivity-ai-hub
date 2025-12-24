import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateSEO } from "@/lib/seo";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Clock, Calendar } from "lucide-react";

export const metadata = generateSEO({
  title: "Blog - AI Productivity Tips & Remote Work Insights",
  description: "Expert insights on AI automation, remote work productivity, team collaboration, and workflow optimization. Updated weekly with actionable tips.",
  keywords: ["productivity blog", "remote work tips", "AI automation", "team collaboration", "workflow optimization"],
});

// This would normally come from a database or CMS
// For now, we'll use a JSON file
async function getBlogPosts() {
  try {
    const posts = await import("@/../content/blog-posts.json");
    return posts.default || [];
  } catch {
    // Return sample posts if file doesn't exist yet
    return [
      {
        title: "Best AI Automation Tools for Remote Teams in 2025",
        slug: "best-ai-automation-tools-remote-teams-2025",
        excerpt: "Discover the top AI automation tools that are transforming how remote teams work. From intelligent scheduling to automated reporting, these tools will 10x your team's productivity.",
        category: "Tools",
        tags: ["AI", "Automation", "Remote Work"],
        publishedAt: new Date().toISOString(),
      },
      {
        title: "How to Eliminate Context Switching with AI Workflows",
        slug: "eliminate-context-switching-ai-workflows",
        excerpt: "Context switching costs teams up to 40% of their productive time. Learn how AI-powered workflows can keep your team in flow state and dramatically boost output.",
        category: "Productivity",
        tags: ["AI", "Workflows", "Focus"],
        publishedAt: new Date().toISOString(),
      },
      {
        title: "10 Productivity Hacks for Distributed Teams",
        slug: "10-productivity-hacks-distributed-teams",
        excerpt: "Battle-tested productivity strategies used by the world's most successful remote teams. Implement these hacks and watch your team's efficiency soar.",
        category: "Remote Work",
        tags: ["Productivity", "Remote Work", "Team Management"],
        publishedAt: new Date().toISOString(),
      },
    ];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container py-24">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Blog & Resources
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Expert insights on remote work, AI automation, and team productivity. New articles every week.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any, index: number) => (
          <Link key={index} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  {post.content && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{getReadingTime(post.content)} min read</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags?.slice(0, 3).map((tag: string, tagIndex: number) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
