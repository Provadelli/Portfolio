/* Primeira visita à página inicial: quem prefere inglês vai para /en.
   Ordem: escolha salva (cookie "lang", gravada pelo seletor PT/EN) > idioma do navegador.
   Robôs de busca e prévias de link sempre recebem o português. */
import { NextResponse, type NextRequest } from "next/server";

/* robôs de busca, prévias de link e agentes de IA (ChatGPT-User, Claude-User, Perplexity-User...) */
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|linkedin|telegram|discord|preview|lighthouse|chatgpt|openai|claude|anthropic|perplexity|gemini|google|mistral|cohere|bing|duckduck|yandex|baidu|headless/i;

export function proxy(request: NextRequest){
  const saved = request.cookies.get("lang")?.value;
  if (saved === "pt") return NextResponse.next();

  const ua = request.headers.get("user-agent") ?? "";
  const accept = request.headers.get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  const wantsEn = saved === "en" || (!BOT.test(ua) && first !== "" && !first.startsWith("pt"));

  if (!wantsEn) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/en";
  return NextResponse.redirect(url, 307);
}

export const config = { matcher: "/" };
