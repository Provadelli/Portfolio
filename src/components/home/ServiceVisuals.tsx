/* Visuais animados dos serviços (SVG + CSS, sem imagens). As animações ficam em globals.css (.viz). */
const GOLD = "#E0BE72", AMBER = "#F2A93B", INK = "#F6F1E6", DIM = "rgba(246,241,230,.14)";

/* sites: janela de navegador montando o layout */
export function VizWeb(){
  return (
    <svg className="viz" viewBox="0 0 300 170" aria-hidden="true">
      <rect x="20" y="16" width="260" height="140" rx="10" fill="#141009" stroke={DIM} />
      <circle cx="34" cy="29" r="3" fill="#2E7D4F" /><circle cx="44" cy="29" r="3" fill="#F4EFE6" /><circle cx="54" cy="29" r="3" fill="#C3343A" />
      <rect x="70" y="24" width="150" height="10" rx="5" fill={DIM} />
      <rect className="grow" x="36" y="52" width="120" height="14" rx="3" fill={INK} />
      <rect className="grow" style={{ animationDelay: ".15s" }} x="36" y="72" width="90" height="8" rx="3" fill={DIM} />
      <rect className="grow" style={{ animationDelay: ".3s" }} x="36" y="92" width="56" height="16" rx="8" fill={AMBER} />
      <rect className="rise" x="176" y="50" width="88" height="58" rx="6" fill={GOLD} opacity=".85" />
      {[0, 1, 2].map(i => <rect key={i} className="grow" style={{ animationDelay: `${.45 + i * .12}s` }} x={36 + i * 78} y="120" width="68" height="24" rx="5" fill="#1C150E" stroke={DIM} />)}
    </svg>
  );
}

/* aplicações web: painel com barras e linha de tendência */
export function VizApp(){
  const bars = [38, 62, 48, 80, 66, 92];
  return (
    <svg className="viz" viewBox="0 0 300 170" aria-hidden="true">
      <rect x="20" y="16" width="260" height="140" rx="10" fill="#141009" stroke={DIM} />
      <rect x="34" y="30" width="60" height="8" rx="4" fill={DIM} />
      <text x="34" y="62" fill={INK} fontSize="20" className="font-display" fontWeight="600">+128%</text>
      {bars.map((h, i) => <rect key={i} className="rise" style={{ animationDelay: `${i * .12}s` }} x={140 + i * 22} y={140 - h} width="14" height={h} rx="3" fill={i === bars.length - 1 ? AMBER : "rgba(224,190,114,.45)"} />)}
      <path className="draw" pathLength={1} d="M34 136 C 60 120, 76 128, 96 108 S 120 96, 128 84" fill="none" stroke={AMBER} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* automação: terminal digitando um script Python */
export function VizAuto(){
  const lines = [
    [AMBER, "$ python automate.py"],
    [INK, "› lendo 1.240 registros…"],
    [INK, "› gerando relatório.pdf"],
    ["#7BDCA3", "✓ concluído em 2,3s"]
  ];
  return (
    <svg className="viz" viewBox="0 0 300 170" aria-hidden="true">
      <rect x="20" y="16" width="260" height="140" rx="10" fill="#0F0B08" stroke={DIM} />
      <circle cx="34" cy="29" r="3" fill="#2E7D4F" /><circle cx="44" cy="29" r="3" fill="#F4EFE6" /><circle cx="54" cy="29" r="3" fill="#C3343A" />
      {lines.map(([c, s], i) => (
        <text key={i} className="type font-mono" style={{ animationDelay: `${i * .5}s` }} x="34" y={64 + i * 22} fill={c} fontSize="12">{s}</text>
      ))}
      <rect className="blink" x="34" y="140" width="8" height="12" fill={AMBER} />
    </svg>
  );
}

/* sistemas embarcados: placa com trilhas e pulsos de sinal */
export function VizEmbedded(){
  const traces = ["M30 50 H110 V85 H150", "M30 120 H90 V95 H150", "M270 60 H210 V85 H190", "M270 120 H220 V100 H190"];
  return (
    <svg className="viz" viewBox="0 0 300 170" aria-hidden="true">
      <rect x="20" y="16" width="260" height="140" rx="10" fill="#141009" stroke={DIM} />
      {traces.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(224,190,114,.35)" strokeWidth="2" />)}
      {traces.map((d, i) => <path key={`p${i}`} className="pulse" style={{ animationDelay: `${i * .4}s` }} pathLength={1} d={d} fill="none" stroke={AMBER} strokeWidth="3" strokeLinecap="round" />)}
      <rect x="150" y="70" width="40" height="44" rx="4" fill="#1C150E" stroke={GOLD} />
      {[0, 1, 2, 3].map(i => <rect key={i} x={154 + i * 9} y="64" width="4" height="6" fill={GOLD} />)}
      {[0, 1, 2, 3].map(i => <rect key={`b${i}`} x={154 + i * 9} y="114" width="4" height="6" fill={GOLD} />)}
      <text x="170" y="96" textAnchor="middle" fill={INK} fontSize="9" className="font-mono">MCU</text>
      {[50, 120].map(y => <circle key={y} cx="30" cy={y} r="5" fill="#C3343A" />)}
      {[60, 120].map(y => <circle key={y} cx="270" cy={y} r="5" fill="#2E7D4F" />)}
    </svg>
  );
}

export const VISUALS = [VizWeb, VizApp, VizAuto, VizEmbedded];
