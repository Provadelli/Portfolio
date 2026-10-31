"use client";
/* true quando a media query bate (no servidor e na hidratação: false) */
import { useSyncExternalStore } from "react";

export function useMedia(query: string){
  return useSyncExternalStore(
    cb => { const m = window.matchMedia(query); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(query).matches,
    () => false
  );
}
