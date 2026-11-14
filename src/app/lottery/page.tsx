import type { Metadata } from "next";
import LotteryWheel from "./wheel";

export const metadata: Metadata = {
  title: "抽獎轉盤",
  description: "輸入名單，轉動轉盤抽出得獎者",
};

const NAVY = "#24215f";
const PINK = "#e8345c";

const stripes = {
  backgroundImage: `repeating-linear-gradient(-45deg, ${PINK} 0 3px, transparent 3px 8px)`,
};

function Zigzag({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 60 12" className={className} aria-hidden>
      <polyline
        points="0,9 7.5,3 15,9 22.5,3 30,9 37.5,3 45,9 52.5,3 60,9"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
      />
    </svg>
  );
}

export default function LotteryPage() {
  return (
    <div
      className="relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-16 pt-12 font-sans"
      style={{ backgroundColor: "#ececee", color: NAVY }}
    >
      {/* 背景裝飾 */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-80"
        style={stripes}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-12 h-48 w-48 rounded-full opacity-80"
        style={stripes}
      />
      <div
        className="pointer-events-none absolute right-[8%] top-[45%] h-36 w-36 rounded-full opacity-70"
        style={stripes}
      />
      <div
        className="pointer-events-none absolute left-[6%] top-[42%] h-10 w-10 rounded-full"
        style={{ backgroundColor: NAVY }}
      />
      <div
        className="pointer-events-none absolute bottom-[18%] right-[18%] h-3 w-3 rounded-full"
        style={{ backgroundColor: NAVY }}
      />
      <Zigzag className="pointer-events-none absolute right-[12%] top-8 w-14" color={NAVY} />
      <Zigzag className="pointer-events-none absolute right-[6%] top-[34%] w-14" color={PINK} />
      <Zigzag className="pointer-events-none absolute bottom-[22%] left-[5%] w-14" color={PINK} />
      <Zigzag className="pointer-events-none absolute bottom-8 left-[40%] w-14" color={NAVY} />

      {/* 標題 */}
      <header className="relative z-10 mb-10 flex flex-col items-center text-center">
        <p className="text-2xl font-extrabold tracking-widest sm:text-3xl" style={{ color: NAVY }}>
          天天好運
        </p>
        <h1
          className="-skew-x-6 text-7xl font-black leading-none tracking-tight sm:text-8xl"
          style={{ color: PINK, textShadow: `5px 5px 0 ${NAVY}` }}
        >
          LUCKY
        </h1>
        <p className="mt-1 text-4xl font-black tracking-wider sm:text-5xl" style={{ color: NAVY }}>
          抽獎轉盤
        </p>
        <div className="mt-5 flex items-center gap-3 text-sm font-semibold" style={{ color: NAVY }}>
          <span className="h-px w-12" style={{ backgroundColor: NAVY }} />
          輸入名單・轉出幸運兒
          <span className="h-px w-12" style={{ backgroundColor: NAVY }} />
        </div>
      </header>

      <LotteryWheel />
    </div>
  );
}
