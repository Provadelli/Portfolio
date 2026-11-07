/* /llms-full.txt: conteúdo completo do site em Markdown (PT + EN), gerado no build */
import { llmsFullTxt, textResponse } from "@/lib/llms";

export const dynamic = "force-static";

export function GET(){
  return textResponse(llmsFullTxt());
}
