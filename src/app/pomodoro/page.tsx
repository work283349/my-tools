import type { Metadata } from "next";
import { Chiron_GoRound_TC, Patrick_Hand } from "next/font/google";
import PomodoroTimer from "./timer";
import { PAPER, Ribbon, RoughFilter } from "./ribbon";

export const metadata: Metadata = {
  title: "蕃茄鐘",
  description: "專注工作、適時休息的蕃茄鐘計時器",
};

const hand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hand",
});

const round = Chiron_GoRound_TC({
  weight: ["400", "600", "800"],
  preload: false,
  variable: "--font-round",
});

const INK = "#35342e";
const SAGE = "#9aae86";
const DUSTY = "#8ea3a6";
const MUSTARD = "#a88f3f";

// 紙張顆粒
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0.55 0'/></filter><rect width='200' height='200' filter='url(#n)'/></svg>`,
)}")`;

export default function PomodoroPage() {
  return (
    <div
      className={`${hand.variable} ${round.variable} relative flex flex-1 flex-col items-center overflow-hidden px-4 pb-20 pt-12`}
      style={{
        backgroundColor: PAPER,
        color: INK,
        fontFamily: "var(--font-hand), var(--font-round), sans-serif",
      }}
    >
      {/* 背景緞帶 */}
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <RoughFilter id="rough-bg" />
        </defs>
      </svg>

      {/* 左上：綠色彎曲 */}
      <svg
        viewBox="0 0 520 640"
        className="pointer-events-none absolute -left-24 -top-16 w-[300px] sm:w-[380px]"
        aria-hidden
        filter="url(#rough-bg)"
      >
        <Ribbon
          color={SAGE}
          width={44}
          lines={3}
          d="M70 -40 C 50 160, 80 300, 200 330 C 310 355, 350 260, 305 180 C 260 95, 330 30, 410 60 C 470 85, 480 170, 430 250"
        />
      </svg>

      {/* 右側：綠色 S 形 */}
      <svg
        viewBox="0 0 360 620"
        className="pointer-events-none absolute -right-28 top-[38%] hidden w-[360px] md:block"
        aria-hidden
        filter="url(#rough-bg)"
      >
        <Ribbon
          color={SAGE}
          width={40}
          lines={3}
          d="M 400 40 C 260 30, 200 140, 250 230 C 300 320, 310 430, 210 470 C 110 510, 60 420, 120 360"
        />
      </svg>

      {/* 左下：灰藍拱形 */}
      <svg
        viewBox="0 0 420 560"
        className="pointer-events-none absolute -bottom-24 -left-32 w-[360px] sm:w-[420px]"
        aria-hidden
        filter="url(#rough-bg)"
      >
        <Ribbon
          color={DUSTY}
          width={44}
          lines={3}
          d="M 20 600 C 60 340, 200 140, 300 160 C 390 180, 370 330, 340 620"
        />
      </svg>

      {/* 右下：芥末黃雙拱 */}
      <svg
        viewBox="0 0 440 260"
        className="pointer-events-none absolute -bottom-10 right-[4%] w-[300px] sm:w-[400px]"
        aria-hidden
        filter="url(#rough-bg)"
      >
        <Ribbon color={MUSTARD} width={40} lines={3} d="M 30 300 C 30 110, 190 110, 190 300" />
        <Ribbon color={MUSTARD} width={40} lines={3} d="M 250 300 C 250 60, 420 60, 420 300" />
      </svg>

      {/* 紙張顆粒 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />

      {/* 標題 */}
      <header className="relative z-10 mb-8 flex flex-col items-center text-center">
        <p className="text-sm uppercase tracking-[0.35em] opacity-70">stay with one thing</p>
        <h1 className="text-7xl leading-none sm:text-8xl">focus</h1>
        <p
          className="mt-3 text-xl font-semibold tracking-[0.4em]"
          style={{ fontFamily: "var(--font-round), sans-serif" }}
        >
          蕃茄鐘
        </p>
      </header>

      <PomodoroTimer />
    </div>
  );
}
