"use client";

import { useEffect, useRef } from "react";

/*
 * 手繪感粗線條：捲動時「一筆畫出來」，同時以不同速度位移做出視差。
 * - draw：線條在畫面中出現的進度（0 → 1）決定畫出多少
 * - speed：視差速度，> 0 比捲動慢（遠），< 0 比捲動快（近）
 * 使用者開啟「減少動態效果」時直接完整顯示、不位移。
 */

type Item = { wrap: HTMLElement; mover: HTMLElement; path: SVGPathElement; speed: number };

const items = new Set<Item>();
let ticking = false;
let listening = false;
let reduced: MediaQueryList | null = null;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function update() {
  ticking = false;
  const vh = window.innerHeight;
  const still = reduced?.matches;
  for (const it of items) {
    const r = it.wrap.getBoundingClientRect();
    if (r.bottom < -vh || r.top > vh * 2) continue;
    // 線條頂端進入畫面 85% 處開始畫，大約捲過線條高度的 70% 時畫完
    const p = still ? 1 : clamp((vh * 0.85 - r.top) / (r.height * 0.7 + vh * 0.25));
    it.path.style.strokeDashoffset = String(1 - p);
    const d = still ? 0 : r.top + r.height / 2 - vh / 2;
    it.mover.style.transform = `translate3d(0, ${(-d * it.speed).toFixed(1)}px, 0)`;
  }
}

function request() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

function listen() {
  if (listening) return;
  listening = true;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  reduced.addEventListener("change", request);
}

export default function Squiggle({
  d,
  viewBox,
  className,
  color = "#1f3560",
  width = 26,
  speed = 0,
}: {
  d: string;
  viewBox: string;
  className?: string;
  color?: string;
  width?: number;
  speed?: number;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const mover = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!wrap.current || !mover.current || !path.current) return;
    const it: Item = { wrap: wrap.current, mover: mover.current, path: path.current, speed };
    items.add(it);
    listen();
    request();
    return () => {
      items.delete(it);
    };
  }, [speed]);

  return (
    <div ref={wrap} aria-hidden className={`pointer-events-none ${className ?? ""}`}>
      <div ref={mover} style={{ willChange: "transform" }}>
        <svg viewBox={viewBox} className="block h-auto w-full overflow-visible">
          <path
            ref={path}
            d={d}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 1"
            strokeDashoffset={1}
            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(.2,.7,.2,1)" }}
          />
        </svg>
      </div>
    </div>
  );
}
