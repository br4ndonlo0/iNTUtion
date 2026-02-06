"use client";

import { useMemo } from "react";

type Drop = {
  left: string;
  delay: string;
  duration: string;
  size: string;
  opacity: string;
};

export default function MoneyRain({
  count = 28,
  emoji = "💸",
}: {
  count?: number;
  emoji?: string;
}) {
  const drops = useMemo<Drop[]>(() => {
    return Array.from({ length: count }).map(() => {
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 4}s`;
      const duration = `${5 + Math.random() * 6}s`; // 5–11s
      const size = `${14 + Math.random() * 18}px`; // 14–32px
      const opacity = `${0.25 + Math.random() * 0.35}`; // 0.25–0.60
      return { left, delay, duration, size, opacity };
    });
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft tint so it looks less flat */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-slate-100/40" />

      {/* money drops */}
      <div className="absolute inset-0">
        {drops.map((d, i) => (
          <span
            key={i}
            className="money-drop absolute -top-10"
            style={{
              left: d.left,
              animationDelay: d.delay,
              animationDuration: d.duration,
              fontSize: d.size,
              opacity: d.opacity,
            }}
            aria-hidden="true"
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}