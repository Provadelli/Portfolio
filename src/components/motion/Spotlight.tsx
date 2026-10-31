"use client";
/* Card cuja borda e fundo acendem seguindo o mouse (via --mx/--my, ver .bento no CSS) */
import type { PointerEvent, ReactNode } from "react";

export function Spotlight({ className = "", children }: { className?: string; children: ReactNode }){
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return <div className={`bento ${className}`} onPointerMove={move}>{children}</div>;
}
