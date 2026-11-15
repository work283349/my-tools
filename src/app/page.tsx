import type { CSSProperties } from "react";
import Link from "next/link";
import { Noto_Serif_TC } from "next/font/google";
import { OmikujiArt, RibbonArt, ToolboxLogo, WheelArt } from "@/components/tool-art";
import MobileNav from "@/components/mobile-nav";
import Parallax from "@/components/parallax";
import Squiggle from "@/components/squiggle";

/* 首頁的手繪曲線路徑 */
const SQ = {
  heroRight:
    "M640 30 C500 -10 360 50 380 160 C400 270 570 260 545 380 C520 500 300 430 280 560 C265 650 380 720 460 700 C540 680 530 590 470 595 C400 600 390 700 430 800",
  heroLeft: "M30 -20 C110 80 110 180 50 260 C-10 340 -10 430 60 500 C120 560 100 650 40 720",
  toolsLeft:
    "M40 -20 C200 60 260 200 160 300 C60 400 20 520 120 600 C220 680 280 760 200 860 C140 940 60 900 90 840 C120 780 220 860 200 980 C180 1100 40 1180 80 1300 C110 1400 220 1420 260 1520",
  toolsRight:
    "M260 -20 C120 80 60 220 160 320 C260 420 280 560 160 640 C60 710 40 820 140 900 C240 980 230 1100 120 1220",
  loop: "M0 190 C60 160 120 110 140 60 C160 10 120 -10 100 30 C80 70 110 150 170 170 C220 185 250 150 270 120",
  wave: "M10 220 C10 120 30 40 80 40 C130 40 120 140 170 140 C220 140 210 40 260 40 C320 40 350 120 350 220",
};

const display = Noto_Serif_TC({
  weight: ["700", "900"],
  preload: false,
  variable: "--font-display",
});

const BG = "#f7f4ee";
const INK = "#1d1b19";
const MUTED = "#6f6a63";
const LINE = "#e3ddd2";

const TOOLS = [
  {
    no: "01",
    href: "/lottery",
    name: "抽獎轉盤",
    en: "Lucky Wheel",
    tagline: "輸入名單，轉出今天的幸運兒。",
    desc: "活動抽獎、決定誰請飲料、午餐吃什麼——貼上名單按下開始，轉盤會停在被抽中的人身上。",
    features: ["一行一位，快速貼上名單", "可設定不重複中獎", "自動保留中獎紀錄"],
    bg: "#ececee",
    ink: "#24215f",
    accent: "#e8345c",
    Art: WheelArt,
  },
  {
    no: "02",
    href: "/pomodoro",
    name: "蕃茄鐘",
    en: "Focus Timer",
    tagline: "一次只做一件事，專注 25 分鐘。",
    desc: "專注與休息自動輪替，每 4 顆蕃茄給自己一段長休息。時間到會響鈴並跳出通知。",
    features: ["專注 / 短休息 / 長休息", "可自訂時間長度", "空白鍵快速開始暫停"],
    bg: "#e9e3d8",
    ink: "#35342e",
    accent: "#7f9670",
    Art: RibbonArt,
  },
  {
    no: "03",
    href: "/fortune",
    name: "好運抽籤",
    en: "Daily Fortune",
    tagline: "搖一搖籤筒，看看今天的運勢。",
    desc: "從大吉到大凶七種籤等，附籤詩、六大運勢與幸運小物。抽到凶籤也別怕，綁起來就好。",
    features: ["七種籤等隨機抽取", "願望、工作、戀愛等六項運勢", "幸運色、幸運物與方位"],
    bg: "#f3ebdd",
    ink: "#2b2622",
    accent: "#c8402f",
    Art: OmikujiArt,
  },
] as const;

const PERKS = [
  { title: "打開就能用", body: "不用註冊、不用安裝，點進去就開始。" },
  { title: "資料留在你這", body: "所有操作都在瀏覽器裡完成，不會上傳名單或紀錄。" },
  { title: "手機也順手", body: "版面會自動調整，會議室、教室、通勤都能用。" },
];

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      className={`${display.variable} flex flex-1 flex-col`}
      style={{ backgroundColor: BG, color: INK }}
    >
      {/* ───────── Header ───────── */}
      <header
        className="sticky top-0 z-50 border-b bg-[#f7f4ee] md:bg-[#f7f4ee]/80 md:backdrop-blur-md"
        style={{ borderColor: LINE }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <ToolboxLogo className="h-7 w-7" />
            <span className="text-lg font-black tracking-wide" style={{ fontFamily: "var(--font-display), serif" }}>
              我的小工具箱
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="group relative py-1" style={{ color: MUTED }}>
                <span className="transition group-hover:text-[#1d1b19]">{t.name}</span>
                <span
                  className="absolute -bottom-0.5 left-0 h-[2px] w-0 transition-all group-hover:w-full"
                  style={{ backgroundColor: t.accent }}
                />
              </Link>
            ))}
          </nav>
          <a
            href="#tools"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold transition hover:opacity-85 md:inline-block"
            style={{ backgroundColor: INK, color: BG }}
          >
            瀏覽工具
          </a>
          <MobileNav items={TOOLS.map(({ href, name, en, accent }) => ({ href, name, en, accent }))} />
        </div>
      </header>

      <main className="flex-1 overflow-x-clip">
        {/* ───────── Hero ───────── */}
        <section className="relative isolate overflow-hidden">
          {/* 手繪曲線：繞過拼貼小卡後方 */}
          <Squiggle
            speed={0.18}
            viewBox="0 0 600 760"
            d={SQ.heroRight}
            className="absolute -right-[8vw] top-[440px] -z-10 w-[78vw] max-w-[720px] sm:top-[520px] lg:-top-4 lg:w-[52vw]"
          />
          <Squiggle
            speed={-0.1}
            viewBox="0 0 120 700"
            d={SQ.heroLeft}
            width={22}
            className="absolute -left-10 top-10 -z-10 hidden w-[110px] xl:block"
          />
          {/* 背景點陣（最遠的一層，移動最慢） */}
          <Parallax speed={0.35} className="pointer-events-none absolute inset-0 -z-20" innerClassName="-mt-40 h-[calc(100%+20rem)]">
          <div
            className="h-full w-full opacity-60"
            style={{
              backgroundImage: `radial-gradient(${LINE} 1.2px, transparent 1.2px)`,
              backgroundSize: "22px 22px",
              maskImage: "radial-gradient(ellipse at 70% 40%, black 20%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at 70% 40%, black 20%, transparent 70%)",
            }}
          />
          </Parallax>
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:pt-16 md:gap-12 md:pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
            <Parallax speed={0.12}>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.2em]" style={{ borderColor: LINE, color: MUTED }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#e8345c" }} />
                LITTLE TOOLBOX · 3 TOOLS
              </p>
              <h1
                className="text-6xl font-black leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl"
                style={{ fontFamily: "var(--font-display), serif" }}
              >
                我的
                <br />
                小工具箱
                <span style={{ color: "#e8345c" }}>.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed" style={{ color: MUTED }}>
                三個小而美的日常工具——抽獎、專注、抽籤。
                <br className="hidden sm:block" />
                不用安裝，打開就用，讓生活多一點效率與好運。
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#tools"
                  className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition hover:gap-3"
                  style={{ backgroundColor: INK, color: BG }}
                >
                  開始使用
                  <Arrow className="h-4 w-4" />
                </a>
                <Link
                  href="/fortune"
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-semibold transition hover:bg-white"
                  style={{ borderColor: INK }}
                >
                  先抽個今日運勢 🎋
                </Link>
              </div>
            </Parallax>

            {/* 拼貼小卡：三張各自不同速度，做出前後景深 */}
            <div className="relative mx-auto h-[420px] w-full max-w-[400px] sm:h-[470px] sm:max-w-[460px]">
              <Parallax speed={0.06} rotate={-0.6} className="absolute left-0 top-6 w-[52%]">
              <Link
                href="/lottery"
                className="block -rotate-6 rounded-3xl p-5 shadow-[0_20px_40px_-20px_rgba(29,27,25,0.35)] transition duration-300 hover:-translate-y-2 hover:-rotate-3"
                style={{ backgroundColor: TOOLS[0].bg }}
                aria-label="抽獎轉盤"
              >
                <WheelArt className="w-full" />
                <p className="mt-2 text-center text-xs font-bold tracking-widest" style={{ color: TOOLS[0].ink }}>
                  LUCKY WHEEL
                </p>
              </Link>
              </Parallax>
              <Parallax speed={0.2} rotate={0.8} className="absolute right-0 top-0 w-[46%]">
              <Link
                href="/pomodoro"
                className="block rotate-6 rounded-3xl p-5 shadow-[0_20px_40px_-20px_rgba(29,27,25,0.35)] transition duration-300 hover:-translate-y-2 hover:rotate-3"
                style={{ backgroundColor: TOOLS[1].bg }}
                aria-label="蕃茄鐘"
              >
                <RibbonArt className="w-full" />
                <p className="mt-1 text-center text-xs font-bold tracking-widest" style={{ color: TOOLS[1].ink }}>
                  FOCUS
                </p>
              </Link>
              </Parallax>
              <Parallax speed={-0.12} rotate={-0.5} className="absolute bottom-0 left-[44%] w-[38%]">
              <Link
                href="/fortune"
                className="block rotate-3 rounded-3xl p-4 shadow-[0_20px_40px_-20px_rgba(29,27,25,0.35)] transition duration-300 hover:-translate-y-2 hover:rotate-0"
                style={{ backgroundColor: TOOLS[2].bg }}
                aria-label="好運抽籤"
              >
                <OmikujiArt className="mx-auto h-40 sm:h-48" />
                <p className="text-center text-xs font-bold tracking-widest" style={{ color: TOOLS[2].accent }}>
                  FORTUNE
                </p>
              </Link>
              </Parallax>
            </div>
          </div>

          {/* 跑馬燈 */}
          <div className="relative border-y py-3" style={{ borderColor: LINE, backgroundColor: INK, color: BG }}>
            <div className="flex overflow-hidden whitespace-nowrap">
              <div className="marquee flex shrink-0 gap-10 pr-10 text-sm font-semibold tracking-[0.3em]">
                {Array.from({ length: 2 }).map((_, k) => (
                  <span key={k} className="flex gap-10">
                    <span>抽獎轉盤</span><span style={{ color: "#e8345c" }}>✦</span>
                    <span>蕃茄鐘</span><span style={{ color: "#9aae86" }}>✦</span>
                    <span>好運抽籤</span><span style={{ color: "#d9b77e" }}>✦</span>
                    <span>LUCKY WHEEL</span><span style={{ color: "#e8345c" }}>✦</span>
                    <span>FOCUS TIMER</span><span style={{ color: "#9aae86" }}>✦</span>
                    <span>DAILY FORTUNE</span><span style={{ color: "#d9b77e" }}>✦</span>
                  </span>
                ))}
              </div>
              <div aria-hidden className="marquee flex shrink-0 gap-10 pr-10 text-sm font-semibold tracking-[0.3em]">
                {Array.from({ length: 2 }).map((_, k) => (
                  <span key={k} className="flex gap-10">
                    <span>抽獎轉盤</span><span style={{ color: "#e8345c" }}>✦</span>
                    <span>蕃茄鐘</span><span style={{ color: "#9aae86" }}>✦</span>
                    <span>好運抽籤</span><span style={{ color: "#d9b77e" }}>✦</span>
                    <span>LUCKY WHEEL</span><span style={{ color: "#e8345c" }}>✦</span>
                    <span>FOCUS TIMER</span><span style={{ color: "#9aae86" }}>✦</span>
                    <span>DAILY FORTUNE</span><span style={{ color: "#d9b77e" }}>✦</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ───────── 工具介紹 ───────── */}
        <section id="tools" className="relative isolate mx-auto max-w-6xl scroll-mt-20 px-5 py-16 sm:py-24">
          {/* 手繪曲線：從卡片之間的縫隙與兩側穿出來 */}
          <Squiggle
            speed={0.12}
            viewBox="0 0 300 1500"
            d={SQ.toolsLeft}
            className="absolute -left-36 top-24 -z-10 w-[300px] sm:-left-44"
          />
          <Squiggle
            speed={-0.12}
            viewBox="0 0 280 1200"
            d={SQ.toolsRight}
            className="absolute -right-36 top-[38%] -z-10 w-[280px] sm:-right-40"
          />
          <Squiggle
            speed={0.25}
            viewBox="0 0 280 220"
            d={SQ.loop}
            width={20}
            className="absolute left-[44%] top-6 -z-10 hidden w-[220px] lg:block"
          />
          <div className="mb-10 flex flex-col justify-between gap-4 sm:mb-14 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.3em]" style={{ color: MUTED }}>
                THE TOOLS
              </p>
              <h2 className="mt-2 text-4xl font-black sm:text-5xl" style={{ fontFamily: "var(--font-display), serif" }}>
                三個工具，各有個性
              </h2>
            </div>
            <p className="max-w-sm" style={{ color: MUTED }}>
              每個工具都有自己的風格與小細節，挑一個現在需要的開始吧。
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {TOOLS.map((t, i) => (
              <article
                key={t.href}
                className="group grid overflow-hidden rounded-[32px] md:grid-cols-2"
                style={{ backgroundColor: t.bg, color: t.ink }}
              >
                <div className={`flex flex-col justify-between gap-8 p-8 sm:p-12 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm font-bold" style={{ color: t.accent }}>
                        {t.no}
                      </span>
                      <span className="text-xs font-semibold tracking-[0.3em] opacity-60">{t.en.toUpperCase()}</span>
                    </div>
                    <h3 className="mt-3 text-4xl font-black sm:text-5xl" style={{ fontFamily: "var(--font-display), serif" }}>
                      {t.name}
                    </h3>
                    <p className="mt-3 text-lg font-semibold">{t.tagline}</p>
                    <p className="mt-4 leading-relaxed opacity-75">{t.desc}</p>
                    <ul className="mt-6 space-y-2">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm font-medium">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: t.accent }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={t.href}
                    className="inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition hover:gap-3"
                    style={{ backgroundColor: t.ink }}
                  >
                    開啟{t.name}
                    <Arrow className="h-4 w-4" />
                  </Link>
                </div>

                <Link
                  href={t.href}
                  className={`relative flex min-h-[260px] items-center justify-center p-8 sm:min-h-[300px] sm:p-10 ${i % 2 === 1 ? "md:order-1" : ""}`}
                  aria-label={`開啟${t.name}`}
                >
                  <div
                    className="absolute inset-6 rounded-[24px] opacity-60"
                    style={{ backgroundColor: "rgba(255,255,255,0.45)" }}
                  />
                  <Parallax speed={0.15} className="pointer-events-none absolute right-8 top-4">
                    <span
                      className="block text-[120px] font-black leading-none opacity-[0.06]"
                      style={{ fontFamily: "var(--font-display), serif" }}
                    >
                      {t.no}
                    </span>
                  </Parallax>
                  <Parallax speed={0.05} className="relative">
                    <t.Art className="h-52 w-auto transition sm:h-64 lg:h-72 duration-500 group-hover:-rotate-3 group-hover:scale-105" />
                  </Parallax>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ───────── 特色 ───────── */}
        <section className="border-t" style={{ borderColor: LINE }}>
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:grid-cols-3 sm:gap-8 sm:py-20 lg:gap-10">
            {PERKS.map((p, i) => (
              <div key={p.title}>
                <span
                  className="text-5xl font-black"
                  style={{ fontFamily: "var(--font-display), serif", color: ["#e8345c", "#9aae86", "#c8402f"][i] }}
                >
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
                <p className="mt-2 leading-relaxed" style={{ color: MUTED }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── CTA ───────── */}
        <section className="mx-auto max-w-6xl px-5 pb-24">
          <div
            className="relative overflow-hidden rounded-[28px] px-6 py-12 text-center sm:rounded-[32px] sm:px-16 sm:py-16"
            style={{ backgroundColor: "#24215f", color: BG }}
          >
            <Parallax speed={0.18} className="pointer-events-none absolute -right-16 -top-16">
              <div
                className="h-56 w-56 rounded-full opacity-60"
                style={{ backgroundImage: "repeating-linear-gradient(-45deg, #e8345c 0 3px, transparent 3px 9px)" }}
              />
            </Parallax>
            {/* 米白色手繪波浪，從底部畫出來 */}
            <Squiggle
              speed={0.15}
              viewBox="0 0 360 230"
              d={SQ.wave}
              color={BG}
              width={22}
              className="absolute -bottom-8 right-[4%] hidden w-[200px] opacity-90 lg:block"
            />
            <Parallax speed={-0.15} className="pointer-events-none absolute -bottom-20 -left-10">
              <div
                className="h-56 w-56 rounded-full opacity-40"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, #9aae86 0 3px, transparent 3px 9px)" }}
              />
            </Parallax>
            <h2 className="relative text-3xl font-black sm:text-5xl" style={{ fontFamily: "var(--font-display), serif" }}>
              今天想先用哪一個？
            </h2>
            <p className="relative mt-4 opacity-75">挑一個開始，剩下的隨時都在這裡等你。</p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-semibold transition hover:bg-white hover:text-[#24215f]"
                  style={{ borderColor: "rgba(247,244,238,0.4)" }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.accent }} />
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ───────── Footer ───────── */}
      <footer style={{ backgroundColor: INK, color: BG, ...({ "--logo-band": INK } as CSSProperties) }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <ToolboxLogo className="h-7 w-7" />
              <span className="text-lg font-black" style={{ fontFamily: "var(--font-display), serif" }}>
                我的小工具箱
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-60">
              收集日常用得到的小工具，簡單、好看、打開就用。
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] opacity-50">TOOLS</p>
            <ul className="mt-4 space-y-2 text-sm">
              {TOOLS.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="opacity-80 transition hover:opacity-100">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] opacity-50">MORE</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#tools" className="opacity-80 transition hover:opacity-100">
                  所有工具
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 transition hover:opacity-100">
                  回到頂端 ↑
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: "rgba(247,244,238,0.12)" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs opacity-50 sm:flex-row">
            <p>© 2026 我的小工具箱. All rights reserved.</p>
            <p>Made with Next.js · 用心做的小工具</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
