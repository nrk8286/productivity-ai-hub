import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { generateBlogPostSEO } from "@/lib/seo";
import { formatDate, getReadingTime } from "@/lib/utils";
import { Calendar, Clock, Share2 } from "lucide-react";

async function getBlogPost(slug: string) {
  try {
    const posts = await import("@/../content/blog-posts.json");
    const allPosts = posts.default || [];
    return allPosts.find((post: any) => post.slug === slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return generateBlogPostSEO({
    title: post.title,
    excerpt: post.excerpt,
    slug: post.slug,
    keywords: post.keywords || post.tags,
    publishedAt: new Date(post.publishedAt),
    updatedAt: new Date(post.updatedAt || post.publishedAt),
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container py-24">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <Badge>{post.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            {post.content && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            )}
            <button className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <Separator className="my-8" />

        <div 
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
        />

        <Separator className="my-8" />

        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
