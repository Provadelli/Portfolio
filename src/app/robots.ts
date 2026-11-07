import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Buscadores e assistentes de IA liberados de forma explícita (além do "*"): alguns só
   indexam quando encontram o próprio nome no robots.txt.
   - OpenAI: OAI-SearchBot (busca do ChatGPT), ChatGPT-User (quando alguém pede para abrir a página), GPTBot
   - Google: Googlebot e Google-Extended (Gemini / AI Overviews)
   - Anthropic: ClaudeBot, Claude-SearchBot, Claude-User
   - Perplexity, Microsoft (Bing / Copilot), Apple (Siri / Apple Intelligence), Meta, DuckDuckGo, Mistral, Amazon */
const AI_AND_SEARCH = [
  "Googlebot", "Google-Extended", "Bingbot", "DuckDuckBot", "Applebot", "Applebot-Extended",
  "OAI-SearchBot", "ChatGPT-User", "GPTBot",
  "ClaudeBot", "Claude-SearchBot", "Claude-User",
  "PerplexityBot", "Perplexity-User",
  "Meta-ExternalAgent", "MistralAI-User", "Amazonbot", "CCBot"
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH, allow: ["/", "/llms.txt", "/llms-full.txt"] }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
