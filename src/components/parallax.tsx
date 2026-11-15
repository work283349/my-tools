"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * 滾動視差：依元素與畫面中心的距離位移內層。
 * speed > 0 → 比捲動慢（像在遠方）；speed < 0 → 比捲動快（像在眼前）。
 * 所有實例共用一個 scroll 監聽與 requestAnimationFrame，只改 transform，不會引起重排。
 * 使用者開啟「減少動態效果」時完全不動。
 */

type Item = { outer: HTMLElement; inner: HTMLElement; speed: number; rotate: number };

const items = new Set<Item>();
let ticking = false;
let listening = false;
let reduced: MediaQueryList | null = null;

function update() {
  ticking = false;
  const vh = window.innerHeight;
  const still = reduced?.matches;
  for (const it of items) {
    const r = it.outer.getBoundingClientRect();
    if (r.bottom < -vh * 0.5 || r.top > vh * 1.5) continue; // 畫面外略過
    const d = still ? 0 : r.top + r.height / 2 - vh / 2;
    const y = -d * it.speed;
    const rot = d * it.rotate * 0.01;
    it.inner.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)${rot ? ` rotate(${rot.toFixed(2)}deg)` : ""}`;
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

export default function Parallax({
  speed = 0.15,
  rotate = 0,
  className,
  innerClassName,
  children,
}: {
  speed?: number;
  /** 每捲動 100px 額外旋轉的角度，做出漂浮感 */
  rotate?: number;
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!outer.current || !inner.current) return;
    const it: Item = { outer: outer.current, inner: inner.current, speed, rotate };
    items.add(it);
    listen();
    request();
    return () => {
      items.delete(it);
    };
  }, [speed, rotate]);

  return (
    <div ref={outer} className={className}>
      <div ref={inner} className={innerClassName} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
