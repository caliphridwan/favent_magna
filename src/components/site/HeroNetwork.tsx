"use client";

import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  { x: 120, y: 110, label: "WIRELESS" },
  { x: 410, y: 100, label: "SECURITY" },
  { x: 440, y: 300, label: "DATA CENTRE" },
  { x: 330, y: 410, label: "CABLING" },
  { x: 110, y: 360, label: "CONNECTIVITY" },
  { x: 70, y: 230, label: "SWITCHING" },
];

/** Animated network-topology illustration for the hero (decorative). */
export function HeroNetwork() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[28px] border border-charcoal bg-[#0D0D0D] md:h-[480px]" aria-hidden>
      <div className="bg-grid-dark absolute inset-0" />
      <svg viewBox="0 0 520 480" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="fm-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#80C83F" stopOpacity="0.28" />
            <stop offset="1" stopColor="#80C83F" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="260" cy="240" r="200" fill="url(#fm-glow)" />
        {nodes.map((n, i) => {
          const next = nodes[(i + 1) % nodes.length];
          return <line key={`r${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y} stroke="#80C83F" strokeOpacity="0.18" />;
        })}
        {nodes.map((n, i) => (
          <motion.line
            key={`s${i}`}
            x1={260}
            y1={240}
            x2={n.x}
            y2={n.y}
            stroke="#80C83F"
            strokeOpacity="0.6"
            strokeWidth="1.2"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, delay: 0.3 + i * 0.12, ease: "easeOut" }}
          />
        ))}
        {!reduce &&
          nodes.map((n, i) => (
            <motion.circle
              key={`p${i}`}
              r="3"
              fill="#A6E06B"
              initial={{ cx: 260, cy: 240, opacity: 0 }}
              animate={{ cx: [260, n.x], cy: [240, n.y], opacity: [0, 1, 0] }}
              transition={{ duration: 2.4, delay: 1.6 + i * 0.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            />
          ))}
        <circle cx="260" cy="240" r="34" fill="#050505" stroke="#80C83F" strokeWidth="2" />
        <motion.circle
          cx="260"
          cy="240"
          r="8"
          fill="#80C83F"
          animate={reduce ? undefined : { r: [8, 11, 8] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        {nodes.map((n, i) => (
          <g key={`n${i}`}>
            <circle cx={n.x} cy={n.y} r="14" fill="#050505" stroke="#80C83F" strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r="4" fill="#80C83F" />
          </g>
        ))}
      </svg>
      <div className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
        {nodes.map((n) => (
          <span key={n.label} className="rounded-full border border-line-dark bg-ink/85 px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[#D4D4D4]">
            {n.label}
          </span>
        ))}
      </div>
    </div>
  );
}
