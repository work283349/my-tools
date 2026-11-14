import type { Metadata } from "next";
import { LXGW_WenKai_TC, Noto_Serif_TC } from "next/font/google";
import FortuneDraw from "./fortune";

export const metadata: Metadata = {
  title: "好運抽籤",
  description: "搖一搖籤筒，抽出今天的運勢",
};

const serif = Noto_Serif_TC({
  weight: ["400", "700", "900"],
  preload: false,
  variable: "--font-serif-tc",
});

const kai = LXGW_WenKai_TC({
  weight: ["400", "700"],
  preload: false,
  variable: "--font-kai",
});

const PAPER = "#f3ebdd";
const INK = "#2b2622";
const VERMILION = "#c8402f";

// 淡淡的青海波紋樣
const WAVES = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'><g fill='none' stroke='#c8402f' stroke-opacity='0.06' stroke-width='1.2'><path d='M0 40a40 40 0 0 1 80 0M10 40a30 30 0 0 1 60 0M20 40a20 20 0 0 1 40 0M30 40a10 10 0 0 1 20 0'/><path d='M-40 20a40 40 0 0 1 80 0M-30 20a30 30 0 0 1 60 0M-20 20a20 20 0 0 1 40 0M-10 20a10 10 0 0 1 20 0'/><path d='M40 20a40 40 0 0 1 80 0M50 20a30 30 0 0 1 60 0M60 20a20 20 0 0 1 40 0M70 20a10 10 0 0 1 20 0'/></g></svg>`,
)}")`;

export default function FortunePage() {
  return (
    <div
      className={`${serif.variable} ${kai.variable} relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-20 pt-12`}
      style={{
        backgroundColor: PAPER,
        backgroundImage: WAVES,
        color: INK,
        fontFamily: "var(--font-serif-tc), serif",
      }}
    >
      {/* 上方垂幕 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-3" style={{ backgroundColor: VERMILION }} />

      <header className="relative z-10 mb-10 flex flex-col items-center text-center">
        <p className="text-sm tracking-[0.6em]" style={{ color: VERMILION }}>
          今日運勢
        </p>
        <h1 className="mt-2 text-5xl font-black tracking-[0.3em] sm:text-6xl">好運抽籤</h1>
        <div className="mt-4 flex items-center gap-3 text-sm tracking-[0.3em]">
          <span className="h-px w-10" style={{ backgroundColor: INK }} />
          誠心一搖・好運自來
          <span className="h-px w-10" style={{ backgroundColor: INK }} />
        </div>
      </header>

      <FortuneDraw />
    </div>
  );
}
