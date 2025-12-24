import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}

export function generateSEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  ogType = "website",
  article,
}: SEOProps): Metadata {
  const siteName = process.env.NEXT_PUBLIC_APP_NAME || "Productivity AI Hub";
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://productivity-ai-hub.com";
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonical || siteUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || siteUrl,
      siteName,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
      locale: "en_US",
      type: ogType as any,
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.author ? [article.author] : undefined,
        tags: article.tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : [],
      creator: "@productivityhub",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateBlogPostSEO(post: {
  title: string;
  excerpt: string;
  slug: string;
  keywords: string[];
  publishedAt: Date;
  updatedAt: Date;
  seoTitle?: string;
  seoDescription?: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://productivity-ai-hub.com";

  return generateSEO({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.keywords,
    canonical: `${siteUrl}/blog/${post.slug}`,
    ogType: "article",
    article: {
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.keywords,
    },
  });
}
