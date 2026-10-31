"use client";
/* Torre de Pisa do hero: inclinada 3,97° no topo da página, endireita conforme a rolagem */
import { useMotionValueEvent, useScroll, useTransform, motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { useI18n } from "@/components/I18nProvider";
import { PisaTower } from "@/components/svg/PisaTower";

const TILT = 3.97;

export function HeroPisa(){
  const { lang } = useI18n();
  const { scrollY } = useScroll();
  const angle = useTransform(scrollY, y => {
    const vh = typeof window === "undefined" ? 800 : window.innerHeight;
    return TILT * (1 - Math.min(y / (vh * 0.75), 1));
  });
  const [label, setLabel] = useState(TILT);
  useMotionValueEvent(angle, "change", setLabel);
  const fmt = (a: number) => a.toFixed(2).replace(".", lang === "en" ? "." : ",") + "°";

  return (
    <svg className="hero__pisa" viewBox="-40 20 300 400" aria-hidden="true" focusable="false">
      <path className="hz hz--ground" style={{ "--i": 24 } as CSSProperties} d="M-30 392H240" pathLength={1} />
      <path className="hz hz--plumb" style={{ "--i": 25 } as CSSProperties} d="M100 400V35" pathLength={1} />
      {/* gira em torno da base da torre (centro-baixo do próprio desenho) */}
      <motion.g style={{ rotate: angle, originX: 0.5, originY: 1, transformBox: "fill-box" }}><PisaTower c="hz" /></motion.g>
      <path className="hz hz--anno" style={{ "--i": 26 } as CSSProperties} d="M200 392V61M193 392H207M193 61H207" pathLength={1} />
      <text className="hz-t" x="210" y="232">{lang === "en" ? "56.67 m" : "56,67 m"}</text>
      <text className="hz-t" x="106" y="31">{fmt(label)}</text>
      <text className="hz-t hz-t--soft" x="-30" y="412">scala 1:400</text>
    </svg>
  );
}
