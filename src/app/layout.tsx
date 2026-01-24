import type { Metadata } from "next";
import "./globals.css";
import { generateSEO } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = generateSEO({
  title: "Productivity AI Hub - AI-Powered Tools for Remote Teams",
  description: "Discover the best AI automation tools and productivity solutions for distributed teams. Boost efficiency, eliminate context switching, and streamline workflows.",
  keywords: ["AI productivity", "remote work tools", "automation", "workflow management", "team collaboration"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
