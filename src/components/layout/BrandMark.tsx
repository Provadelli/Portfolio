import Link from "next/link";
import { LogoP } from "@/components/svg/LogoP";
import { href, type Dictionary, type Lang } from "@/lib/i18n";

export function BrandMark({ lang, t }: { lang: Lang; t: Dictionary }){
  return (
    <Link href={href(lang)} className="brand-mark inline-flex min-h-11 items-center" aria-label={t.home_label}>
      <svg viewBox="360 270 560 700" aria-hidden="true" focusable="false"><LogoP /></svg>
    </Link>
  );
}
