"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  CATEGORIES,
  DIRECTIONS,
  LUCKY_COLORS,
  LUCKY_ITEMS,
  MESSAGES,
  POEMS,
  SUMMARY,
  drawLevel,
  pick,
  type Category,
  type Level,
  type Tier,
} from "./data";

const PAPER = "#f3ebdd";
const SLIP = "#fbf6ec";
const INK = "#2b2622";
const MUTED = "#7a6e62";
const VERMILION = "#c8402f";
const BAMBOO = "#d9b77e";
const BOX_TOP = "#f6d29c";
const BOX_FRONT = "#f0c48a";
const BOX_SIDE_L = "#e3b073";
const BOX_SIDE_R = "#d39d5e";
const RED = "#d8392b";
const RED_DARK = "#c23125";
const RED_DARKER = "#a8281e";
const KAI = "var(--font-kai), var(--font-serif-tc), serif";

type Phase = "idle" | "shaking" | "stick" | "open" | "tied";

type Result = {
  level: Level;
  tier: Tier;
  number: number;
  poem: string[];
  summary: string;
  messages: Record<Category, string>;
  color: (typeof LUCKY_COLORS)[number];
  item: string;
  direction: string;
  luckyNumber: number;
  date: string;
};

const CN_NUM = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
function toChineseNumber(n: number) {
  // 1–99
  if (n < 10) return CN_NUM[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${t === 1 ? "" : CN_NUM[t]}十${o === 0 ? "" : CN_NUM[o]}`;
}

function makeResult(): Result {
  const { level, tier } = drawLevel();
  const now = new Date();
  const messages = Object.fromEntries(
    CATEGORIES.map((c) => [c, pick(MESSAGES[c][tier])]),
  ) as Record<Category, string>;
  return {
    level,
    tier,
    number: 1 + Math.floor(Math.random() * 99),
    poem: pick(POEMS[level]),
    summary: SUMMARY[level],
    messages,
    color: pick(LUCKY_COLORS),
    item: pick(LUCKY_ITEMS),
    direction: pick(DIRECTIONS),
    luckyNumber: 1 + Math.floor(Math.random() * 9),
    date: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`,
  };
}

export default function FortuneDraw() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const timers = useRef<number[]>([]);
  const slipRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => clearTimeout(t));
  }, []);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function draw() {
    if (phase === "shaking" || phase === "stick") return;
    const r = makeResult();
    setResult(null);
    setPhase("shaking");
    later(() => {
      setResult(r);
      setPhase("stick");
    }, 1500);
    later(() => setPhase("open"), 2700);
    // 手機／平板：籤紙在下方，展開後自動捲過去
    later(() => {
      if (window.innerWidth < 1024) {
        slipRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 2800);
  }

  function tie() {
    setPhase("tied");
  }

  const busy = phase === "shaking" || phase === "stick";
  const accent = result?.tier === "bad" ? INK : VERMILION;

  return (
    <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-start lg:justify-center">
      <style>{`
        @keyframes shake {
          0%,100% { transform: rotate(0) translateY(0); }
          10% { transform: rotate(-14deg) translateY(-6px); }
          20% { transform: rotate(12deg) translateY(2px); }
          30% { transform: rotate(-12deg) translateY(-8px); }
          40% { transform: rotate(14deg) translateY(0); }
          50% { transform: rotate(-10deg) translateY(-6px); }
          60% { transform: rotate(10deg) translateY(2px); }
          70% { transform: rotate(-8deg) translateY(-4px); }
          80% { transform: rotate(6deg) translateY(0); }
          90% { transform: rotate(-3deg) translateY(-2px); }
        }
        @keyframes stick-out {
          from { transform: translateY(0); }
          to { transform: translateY(-104px); }
        }
        @keyframes unroll {
          from { clip-path: inset(0 0 100% 0); transform: translateY(-12px); }
          to { clip-path: inset(0 0 0 0); transform: translateY(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tie-up {
          0% { transform: scale(1) rotate(0); opacity: 1; }
          60% { transform: scaleY(0.08) scaleX(0.9) rotate(-4deg); opacity: 1; }
          100% { transform: scaleY(0.08) scaleX(0.2) rotate(-4deg) translateY(-200px); opacity: 0; }
        }
        .shake { animation: shake 1.5s ease-in-out; transform-origin: 50% 90%; }
        .stick-out { animation: stick-out 0.9s cubic-bezier(.2,.8,.3,1.2) forwards; }
        .unroll { animation: unroll 0.9s cubic-bezier(.2,.7,.2,1) both; }
        .fade-up { animation: fade-up 0.5s ease-out both; }
        .tie-up { animation: tie-up 0.9s ease-in forwards; transform-origin: 50% 0; }
        @media (prefers-reduced-motion: reduce) {
          .shake, .stick-out, .unroll, .fade-up, .tie-up { animation-duration: 1ms !important; }
        }
      `}</style>

      {/* 籤筒（六角籤筒） */}
      <section className="flex w-full max-w-xs flex-col items-center">
        <div className="relative h-[330px] w-[218px] sm:h-[440px] sm:w-[290px]">
          <svg
            viewBox="-25 -60 290 440"
            className={`h-full w-full ${phase === "shaking" ? "shake" : ""}`}
            aria-hidden
          >
            <defs>
              {/* 只顯示洞口以上的籤 */}
              <clipPath id="above-hole" clipPathUnits="userSpaceOnUse">
                <rect x={0} y={-400} width={240} height={470} />
              </clipPath>
            </defs>
            <g transform="rotate(22 120 200)">
              {/* 側面 */}
              <polygon points="50,70 80,88 80,348 50,330" fill={BOX_SIDE_L} />
              <polygon points="80,88 160,88 160,348 80,348" fill={BOX_FRONT} />
              <polygon points="160,88 190,70 190,330 160,348" fill={BOX_SIDE_R} />
              {/* 上方紅帶 */}
              <polygon points="50,70 80,88 80,108 50,90" fill={RED_DARK} />
              <polygon points="80,88 160,88 160,108 80,108" fill={RED} />
              <polygon points="160,88 190,70 190,90 160,108" fill={RED_DARKER} />
              {/* 下方紅帶 */}
              <polygon points="50,306 80,324 80,348 50,330" fill={RED_DARK} />
              <polygon points="80,324 160,324 160,348 80,348" fill={RED} />
              <polygon points="160,324 190,306 190,330 160,348" fill={RED_DARKER} />
              {/* 頂面 */}
              <polygon points="50,70 80,52 160,52 190,70 160,88 80,88" fill={BOX_TOP} />
              <ellipse cx={120} cy={70} rx={15} ry={8} fill="#5b3b1f" />

              {/* 籤：從洞口滑出 */}
              <g clipPath="url(#above-hole)">
                <g
                  className={phase === "stick" || phase === "open" || phase === "tied" ? "stick-out" : ""}
                  style={{ animationFillMode: "forwards" }}
                >
                  <rect x={111} y={46} width={18} height={180} rx={2} fill={BAMBOO} stroke="#b8935a" strokeWidth={1} />
                  <rect x={111} y={46} width={18} height={10} rx={2} fill={RED} />
                  {result &&
                    `第${toChineseNumber(result.number)}籤`.split("").map((ch, i) => (
                      <text
                        key={i}
                        x={120}
                        y={76 + i * 15}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight={700}
                        fill={VERMILION}
                        style={{ fontFamily: "var(--font-serif-tc), serif" }}
                      >
                        {ch}
                      </text>
                    ))}
                </g>
              </g>

              {/* 正面直書文字 */}
              {["好", "運", "籤"].map((ch, i) => (
                <text
                  key={ch}
                  x={120}
                  y={168 + i * 50}
                  textAnchor="middle"
                  fontSize={40}
                  fontWeight={900}
                  fill={INK}
                  style={{ fontFamily: "var(--font-serif-tc), serif" }}
                >
                  {ch}
                </text>
              ))}
            </g>
          </svg>
        </div>

        <button
          onClick={draw}
          disabled={busy}
          className="mt-6 h-14 w-48 rounded-sm sm:mt-10 text-xl font-bold tracking-[0.4em] text-white shadow-[4px_4px_0_#2b2622] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_#2b2622] disabled:cursor-not-allowed disabled:opacity-70"
          style={{ backgroundColor: VERMILION }}
        >
          {phase === "idle" ? "搖籤" : busy ? "搖籤中…" : "再抽一次"}
        </button>
        <p className="mt-4 text-center text-sm tracking-widest" style={{ color: MUTED }}>
          {phase === "idle" && "心中默想今天的事，按下搖籤"}
          {phase === "shaking" && "誠心祈求中……"}
          {phase === "stick" && "籤出來了！"}
          {phase === "open" && "願今天一切順心"}
          {phase === "tied" && "壞運已經綁在這裡了，放心出發吧"}
        </p>
      </section>

      {/* 籤紙 */}
      <section ref={slipRef} className="w-full max-w-xl scroll-mt-6">
        {phase === "open" && result && <Slip result={result} accent={accent} onTie={tie} />}
        {phase === "tied" && result && (
          <div className="tie-up">
            <Slip result={result} accent={accent} />
          </div>
        )}
        {(phase === "idle" || busy) && (
          <div
            className="hidden min-h-[420px] items-center justify-center rounded-sm border-2 border-dashed lg:flex"
            style={{ borderColor: "#d8c9b0", color: MUTED, backgroundColor: "rgba(251, 246, 236, 0.7)" }}
          >
            <p className="text-lg tracking-[0.4em]" style={{ writingMode: "vertical-rl", fontFamily: KAI }}>
              {busy ? "籤紙即將展開" : "籤紙會出現在這裡"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Slip({
  result,
  accent,
  onTie,
}: {
  result: Result;
  accent: string;
  onTie?: () => void;
}) {
  return (
    <article
      className="unroll relative rounded-sm p-2 shadow-[0_12px_30px_-12px_rgba(43,38,34,0.35)]"
      style={{ backgroundColor: SLIP }}
    >
      <div className="rounded-sm border-[3px] p-1" style={{ borderColor: accent }}>
        <div className="rounded-sm border px-5 py-6 sm:px-8" style={{ borderColor: accent }}>
          {/* 頂部 */}
          <header className="flex items-start justify-between text-sm tracking-widest" style={{ color: MUTED }}>
            <span>第 {toChineseNumber(result.number)} 籤</span>
            <span>{result.date}</span>
          </header>

          {/* 籤等 + 籤詩 */}
          <div className="mt-4 flex flex-row-reverse items-stretch justify-center gap-5 sm:gap-8">
            <div
              className="flex items-center justify-center rounded-sm px-4 py-5 text-white"
              style={{ backgroundColor: accent }}
            >
              <span
                className="text-5xl font-black leading-none tracking-[0.15em] sm:text-7xl"
                style={{ writingMode: "vertical-rl" }}
              >
                {result.level}
              </span>
            </div>
            <div
              className="flex flex-row-reverse gap-3 text-xl leading-relaxed tracking-[0.2em] sm:gap-4 sm:text-2xl sm:tracking-[0.25em]"
              style={{ fontFamily: KAI }}
            >
              {result.poem.map((line, i) => (
                <p
                  key={i}
                  className="fade-up"
                  style={{ writingMode: "vertical-rl", animationDelay: `${0.6 + i * 0.2}s` }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <p
            className="fade-up mt-6 border-y py-3 text-center text-base leading-relaxed"
            style={{ borderColor: "#e3d6c0", fontFamily: KAI, animationDelay: "1s" }}
          >
            {result.summary}
          </p>

          {/* 各項運勢 */}
          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {CATEGORIES.map((c, i) => (
              <div
                key={c}
                className="fade-up flex items-start gap-3"
                style={{ animationDelay: `${1.1 + i * 0.08}s` }}
              >
                <dt
                  className="shrink-0 rounded-sm px-1.5 py-0.5 text-sm font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {c}
                </dt>
                <dd className="text-[15px] leading-snug" style={{ fontFamily: KAI }}>
                  {result.messages[c]}
                </dd>
              </div>
            ))}
          </dl>

          {/* 幸運小物 */}
          <div
            className="fade-up mt-6 grid grid-cols-2 gap-3 rounded-sm p-4 text-sm sm:grid-cols-4"
            style={{ backgroundColor: PAPER, animationDelay: "1.7s" }}
          >
            <Lucky label="幸運色">
              <span
                className="mr-1.5 inline-block h-3.5 w-3.5 rounded-full border align-[-2px]"
                style={{ backgroundColor: result.color.hex, borderColor: "#00000022" }}
              />
              {result.color.name}
            </Lucky>
            <Lucky label="幸運物">{result.item}</Lucky>
            <Lucky label="幸運方位">{result.direction}方</Lucky>
            <Lucky label="幸運數字">{result.luckyNumber}</Lucky>
          </div>

          {result.tier === "bad" && onTie && (
            <div className="fade-up mt-5 flex flex-col items-center gap-2" style={{ animationDelay: "1.9s" }}>
              <p className="text-sm" style={{ color: MUTED }}>
                抽到凶籤別擔心——把它綁起來，壞運就留在這裡
              </p>
              <button
                onClick={onTie}
                className="rounded-sm border-2 px-5 py-1.5 text-sm font-bold tracking-[0.3em] transition hover:bg-white"
                style={{ borderColor: INK, color: INK }}
              >
                綁起來
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Lucky({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span className="text-xs tracking-widest" style={{ color: MUTED }}>
        {label}
      </span>
      <span className="font-bold" style={{ fontFamily: KAI }}>
        {children}
      </span>
    </div>
  );
}
