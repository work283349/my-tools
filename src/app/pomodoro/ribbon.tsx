import type { SVGProps } from "react";

export const PAPER = "#e9e3d8";

/**
 * 手繪感緞帶：同一條路徑疊出「色線／紙色縫隙」交錯的多條平行線，
 * 圓頭端點會自然形成巢狀的 U 形收尾。
 */
export function Ribbon({
  d,
  color,
  width = 36,
  lines = 3,
  gap = PAPER,
  ...rest
}: {
  d: string;
  color: string;
  width?: number;
  lines?: number;
  gap?: string;
} & Omit<SVGProps<SVGPathElement>, "d" | "color">) {
  // lines 條色線 → 2*lines-1 層，由粗到細交替上色
  const layers = 2 * lines - 1;
  const step = width / layers;
  return (
    <g>
      {Array.from({ length: layers }).map((_, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={i % 2 === 0 ? color : gap}
          strokeWidth={width - i * step}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...rest}
        />
      ))}
    </g>
  );
}

/** 讓線條邊緣有一點手繪抖動 */
export function RoughFilter({ id, scale = 2.5 }: { id: string; scale?: number }) {
  return (
    <filter id={id} x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={3} />
      <feDisplacementMap in="SourceGraphic" scale={scale} />
    </filter>
  );
}
