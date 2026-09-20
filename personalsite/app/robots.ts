import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Known AI crawlers, listed explicitly so intent to allow AI access is unambiguous
// even if the wildcard rule below ever changes.
const aiAgents = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "Bytespider",
  "Amazonbot",
  "cohere-ai",
  "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/manage" },
      { userAgent: aiAgents, allow: "/", disallow: "/manage" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
