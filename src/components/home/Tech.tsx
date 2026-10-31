import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import type { Dictionary } from "@/lib/i18n";
import { SectionHead } from "./SectionHead";

type Card = [icon: string, name: string, level?: string];

export function Tech({ t }: { t: Dictionary }){
  const groups: [title: string, cards: Card[], gold: boolean][] = [
    [t.tech_dev, [["</>", "HTML", t.lv_daily], ["{ }", "CSS", t.lv_daily], ["JS", "JavaScript", t.lv_daily], ["Py", "Python", t.lv_mid], ["C++", "C++", t.lv_acad]], false],
    [t.tech_tools, [["⎇", "Git", t.lv_git], ["◐", "GitHub", t.lv_gh], ["▤", "VS Code", t.lv_ed], ["▲", "Vercel", t.lv_dep]], false],
    [t.tech_learning, [["◇", t.l1], ["▦", t.l2], ["△", t.l3], ["⇄", "APIs"], ["✦", t.l5]], true]
  ];

  return (
    <section className="section theme-light" id="tecnologias" aria-labelledby="tec-title">
      <div className="wrap">
        <SectionHead id="tec-title" eyebrow={t.tech_eyebrow} title={t.tech_title} />
        <div className="grid gap-9 lg:grid-cols-3 lg:gap-10">
          {groups.map(([title, cards, gold], g) => (
            <div key={title}>
              <Reveal as="h3" className="tech-heading" delay={g * 0.08}>{title}</Reveal>
              <Stagger
                className="grid gap-3" itemClassName={gold ? "tech-card tech-card--gold" : "tech-card"} step={0.06} y={18}
                items={cards.map(([icon, name, level]) => ({
                  key: name,
                  content: <><span className="tech-icon" aria-hidden="true">{icon}</span><b>{name}</b>{level && <small>{level}</small>}</>
                }))}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
