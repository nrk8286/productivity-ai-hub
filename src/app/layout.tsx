import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { generateSEO } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
