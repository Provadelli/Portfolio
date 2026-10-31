"use client";
/* A tela de carregamento coloca a classe "is-loading" no <html>. Enquanto ela existir,
   as animações de entrada esperam; o Loader dispara "loaderdone" ao terminar. */
import { useSyncExternalStore } from "react";

export const LOADER_DONE = "loaderdone";

const subscribe = (cb: () => void) => {
  window.addEventListener(LOADER_DONE, cb);
  return () => window.removeEventListener(LOADER_DONE, cb);
};
const snapshot = () => !document.documentElement.classList.contains("is-loading");

export const useLoaderDone = () => useSyncExternalStore(subscribe, snapshot, () => false);
