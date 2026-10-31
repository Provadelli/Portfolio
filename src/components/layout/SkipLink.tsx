import type { Dictionary } from "@/lib/i18n";

export function SkipLink({ t }: { t: Dictionary }){
  return <a href="#main" className="skip-link">{t.skip}</a>;
}
