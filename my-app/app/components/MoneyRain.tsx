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
  count = 10,
  emoji = "💸",
}: {
  count?: number;
  emoji?: string;
}) {
  const drops = useMemo<Drop[]>(() => {
    return Array.from({ length: count }).map(() => {
      const left = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 4}s`;
      const duration = `${8 + Math.random() * 7}s`; // 8–15s
      const size = `${18 + Math.random() * 20}px`; // 18–38px
      const opacity = `${0.4 + Math.random() * 0.35}`; // 0.4–0.75
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