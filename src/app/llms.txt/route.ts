/* /llms.txt: resumo do site em Markdown para assistentes de IA (gerado no build) */
import { llmsTxt, textResponse } from "@/lib/llms";

export const dynamic = "force-static";

export function GET(){
  return textResponse(llmsTxt());
}
