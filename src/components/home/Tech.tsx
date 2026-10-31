import { Reveal } from "@/components/motion/Reveal";
import { Spotlight } from "@/components/motion/Spotlight";
import type { Dictionary } from "@/lib/i18n";
import { SectionHead } from "./SectionHead";

type Row = [icon: string, name: string, level?: string];
const NL = String.fromCharCode(10);   // quebra de linha dentro do <pre>

function Marquee({ words, reverse = false, dur = "45s" }: { words: string[]; reverse?: boolean; dur?: string }){
  const track = (hidden: boolean) => (
    <ul className="marquee__track m-0 list-none p-0" aria-hidden={hidden || undefined} style={{ "--dur": dur } as React.CSSProperties}>
      {words.map(w => (
        <li key={w} className="flex items-center gap-10 font-display text-[clamp(28px,4.4vw,64px)] font-semibold tracking-[-.04em] whitespace-nowrap text-[rgba(246,241,230,.85)]">
          {w}<span className="text-[.5em] text-gold" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  );
  return <div className={`marquee ${reverse ? "marquee--rev" : ""}`} aria-hidden="true">{track(false)}{track(true)}</div>;
}

export function Tech({ t }: { t: Dictionary }){
  const groups: [title: string, tag: string, rows: Row[], wide: boolean][] = [
    [t.tech_dev, "01", [["</>", "HTML", t.lv_daily], ["{ }", "CSS", t.lv_daily], ["JS", "JavaScript", t.lv_daily], ["TS", "TypeScript", t.lv_mid], ["Py", "Python", t.lv_mid], ["C++", "C++", t.lv_acad]], true],
    [t.tech_tools, "02", [["⎇", "Git", t.lv_git], ["◐", "GitHub", t.lv_gh], ["▤", "VS Code", t.lv_ed], ["▲", "Vercel", t.lv_dep]], false],
    [t.tech_learning, "03", [["◇", t.l1], ["▦", t.l2], ["△", t.l3], ["⇄", "APIs"], ["✦", t.l5]], false]
  ];
  const all = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Python", "C++", "Arduino", "Git", "Vercel", "Tailwind"];

  return (
    <section className="section overflow-hidden" id="tecnologias" aria-labelledby="tec-title">
      <div className="wrap">
        <SectionHead id="tec-title" eyebrow={t.tech_eyebrow} title={t.tech_title} />
        <div className="grid gap-5 lg:grid-cols-2">
          {groups.map(([title, tag, rows, wide], g) => (
            <Reveal key={title} delay={g * 0.1} className={wide ? "lg:row-span-2" : undefined}>
              <Spotlight className="flex h-full flex-col">
                <div className="relative z-1 mb-5 flex items-center justify-between">
                  <h3 className="m-0 font-display text-xl font-semibold tracking-[-.02em]">{title}</h3>
                  <span className="font-mono text-xs text-gold-deep">{tag}</span>
                </div>
                <ul className="relative z-1 m-0 list-none p-0">
                  {rows.map(([icon, name, level]) => (
                    <li key={name} className="tech-row">
                      <span className="tech-icon" aria-hidden="true">{icon}</span>
                      <b className="flex-1 text-[15px] font-semibold">{name}</b>
                      {level && <small className="font-mono text-[11px] text-ink-faint">{level}</small>}
                    </li>
                  ))}
                </ul>
                {wide && (
                  <pre className="relative z-1 mt-auto overflow-x-auto rounded-2xl border border-line bg-bg p-5 pt-4 font-mono text-[12.5px] leading-[1.8] text-ink-soft max-lg:mt-6" aria-hidden="true">
                    <span className="text-ink-faint">{"// stack.ts"}</span>{NL}
                    <span className="text-gold-deep">const</span> dev = {"{"}{NL}
                    {"  "}web: [<span className="text-[#7BDCA3]">&quot;Next.js&quot;</span>, <span className="text-[#7BDCA3]">&quot;React&quot;</span>, <span className="text-[#7BDCA3]">&quot;TypeScript&quot;</span>],{NL}
                    {"  "}automation: <span className="text-[#7BDCA3]">&quot;Python&quot;</span>,{NL}
                    {"  "}embedded: <span className="text-[#7BDCA3]">&quot;C++ / Arduino&quot;</span>,{NL}
                    {"  "}origin: <span className="text-[#F2A93B]">&quot;🇮🇹 → 🇧🇷&quot;</span>{NL}
                    {"}"};<span className="blink text-gold-deep">▍</span>
                  </pre>
                )}
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-20 grid gap-4 sm:mt-28">
        <Marquee words={all} />
        <Marquee words={[...all].reverse()} reverse dur="55s" />
      </div>
    </section>
  );
}
