"use client";

import { useEffect, useState } from "react";
import { PAPER, Ribbon, RoughFilter } from "./ribbon";

const INK = "#35342e";
const MUTED = "#7d786c";
const LINE = "#cfc6b6";
const CARD = "rgba(243, 239, 231, 0.82)";
const ROUND = "var(--font-round), sans-serif";

type Mode = "focus" | "short" | "long";

const MODE_COLOR: Record<Mode, string> = {
  focus: "#9aae86",
  short: "#8ea3a6",
  long: "#a88f3f",
};

const MODE_QUOTE: Record<Mode, string[]> = {
  focus: ["one thing", "at a time"],
  short: ["breathe in,", "breathe out"],
  long: ["you deserve", "a real rest"],
};

const MODE_LABEL: Record<Mode, string> = {
  focus: "專注",
  short: "短休息",
  long: "長休息",
};

const MODE_HINT: Record<Mode, string> = {
  focus: "專心做一件事，別分心！",
  short: "起來走走、喝口水吧",
  long: "好好休息，你做得很棒",
};

const LONG_BREAK_EVERY = 4;

function formatTime(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.25, 0.5].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = [880, 1046.5, 1318.5][i];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.65);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    // 瀏覽器不支援音效就略過
  }
}

function notify(title: string, body: string) {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    try {
      new Notification(title, { body });
    } catch {
      // 部分瀏覽器不允許在頁面中直接建立通知
    }
  }
}

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState<Record<Mode, number>>({
    focus: 25,
    short: 5,
    long: 15,
  });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [completed, setCompleted] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const [task, setTask] = useState("");
  const [log, setLog] = useState<{ task: string; time: string }[]>([]);

  const running = endAt !== null;
  const total = minutes[mode] * 60 * 1000;
  const progress = total > 0 ? 1 - remaining / total : 0;

  // 計時：用結束時間戳計算，切換分頁或背景執行也不會跑慢
  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const left = endAt - Date.now();
      if (left > 0) {
        setRemaining(left);
        return;
      }

      // 時間到
      playChime();
      let next: Mode;
      if (mode === "focus") {
        const done = completed + 1;
        setCompleted(done);
        const now = new Date();
        setLog((l) => [
          {
            task: task.trim() || "未命名的專注",
            time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
          },
          ...l,
        ]);
        next = done % LONG_BREAK_EVERY === 0 ? "long" : "short";
        notify("專注完成！🍅", `休息一下吧（${MODE_LABEL[next]} ${minutes[next]} 分鐘）`);
      } else {
        next = "focus";
        notify("休息結束！", `開始下一輪專注（${minutes.focus} 分鐘）`);
      }
      const nextMs = minutes[next] * 60 * 1000;
      setMode(next);
      setRemaining(nextMs);
      setEndAt(autoStart ? Date.now() + nextMs : null);
    }, 200);
    return () => clearInterval(id);
  }, [endAt, mode, completed, minutes, autoStart, task]);

  // 分頁標題顯示倒數
  useEffect(() => {
    const prev = document.title;
    document.title = `${formatTime(remaining)} ${running ? "⏵" : "⏸"} ${MODE_LABEL[mode]}｜蕃茄鐘`;
    return () => {
      document.title = prev;
    };
  }, [remaining, running, mode]);

  function start() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
    setEndAt(Date.now() + remaining);
  }

  function pause() {
    if (endAt === null) return;
    setRemaining(Math.max(0, endAt - Date.now()));
    setEndAt(null);
  }

  function toggle() {
    if (running) pause();
    else start();
  }

  function reset() {
    setEndAt(null);
    setRemaining(total);
  }

  function switchMode(m: Mode) {
    setEndAt(null);
    setMode(m);
    setRemaining(minutes[m] * 60 * 1000);
  }

  function skip() {
    // 跳到下一段（專注中跳過不計入完成數）
    switchMode(mode === "focus" ? "short" : "focus");
  }

  function changeMinutes(m: Mode, value: number) {
    const v = Math.min(120, Math.max(1, Math.round(value) || 1));
    setMinutes((prev) => ({ ...prev, [m]: v }));
    if (m === mode && !running) setRemaining(v * 60 * 1000);
  }

  // 空白鍵開始／暫停
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (e.code !== "Space" || tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      e.preventDefault();
      if (endAt !== null) {
        setRemaining(Math.max(0, endAt - Date.now()));
        setEndAt(null);
      } else {
        setEndAt(Date.now() + remaining);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [endAt, remaining]);

  const accent = MODE_COLOR[mode];
  const cycleDots = completed % LONG_BREAK_EVERY;
  const clamped = Math.min(1, Math.max(0, progress));

  // 進度緞帶（圓）
  const RR = 160;
  const RC = 2 * Math.PI * RR;
  const ringPath = `M 200 ${200 - RR} A ${RR} ${RR} 0 1 1 199.99 ${200 - RR}`;

  const card = "rounded-[28px] border-[1.5px] p-6 backdrop-blur-[2px]";
  const cardStyle = { borderColor: LINE, backgroundColor: CARD };
  const heading = "mb-3 text-xl uppercase tracking-[0.2em]";

  return (
    <div className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-center">
      {/* 計時器 */}
      <section className="flex w-full max-w-[440px] flex-col items-center">
        {/* 模式切換 */}
        <div className="mb-4 flex gap-6" role="tablist">
          {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className="relative pb-2 text-base font-semibold transition"
              style={{ fontFamily: ROUND, color: mode === m ? INK : MUTED }}
            >
              {MODE_LABEL[m]}
              {/* 手繪底線 */}
              <svg
                viewBox="0 0 60 8"
                className="absolute bottom-0 left-1/2 w-12 -translate-x-1/2 transition-opacity"
                style={{ opacity: mode === m ? 1 : 0 }}
                aria-hidden
              >
                <path
                  d="M2 5 C 12 1, 20 8, 30 4 S 50 1, 58 5"
                  fill="none"
                  stroke={MODE_COLOR[m]}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* 緞帶圓環 */}
        <div className="relative aspect-square w-full">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <RoughFilter id="rough-ring" scale={2} />
            </defs>
            <g filter="url(#rough-ring)">
              {/* 底圈（淡） */}
              <g opacity={0.35}>
                <Ribbon d={ringPath} color={accent} width={40} lines={3} />
              </g>
              {/* 進度 */}
              {clamped > 0.002 && (
                <Ribbon
                  d={ringPath}
                  color={accent}
                  width={40}
                  lines={3}
                  gap={PAPER}
                  strokeDasharray={RC}
                  strokeDashoffset={RC * (1 - clamped)}
                  style={{ transition: "stroke-dashoffset 0.25s linear, stroke 0.4s" }}
                />
              )}
            </g>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm uppercase tracking-[0.3em]" style={{ color: MUTED }}>
              {mode === "focus" ? "focus" : mode === "short" ? "short break" : "long break"}
            </span>
            <span className="text-8xl leading-none tabular-nums">{formatTime(remaining)}</span>
            <span className="mt-3 text-center text-base uppercase leading-tight tracking-[0.15em]">
              {MODE_QUOTE[mode][0]}
              <br />
              {MODE_QUOTE[mode][1]}
            </span>
          </div>
        </div>

        <p className="mt-2 text-sm" style={{ color: MUTED, fontFamily: ROUND }}>
          {MODE_HINT[mode]}
        </p>

        {/* 控制按鈕 */}
        <div className="mt-6 flex items-center gap-4" style={{ fontFamily: ROUND }}>
          <button
            onClick={reset}
            className="h-11 rounded-full border-[1.5px] px-5 text-sm font-semibold transition hover:bg-white/40"
            style={{ borderColor: INK, color: INK }}
          >
            重設
          </button>
          <button
            onClick={toggle}
            className="h-14 w-36 rounded-full text-xl font-extrabold tracking-widest transition hover:brightness-110 active:scale-95"
            style={{ backgroundColor: INK, color: PAPER }}
          >
            {running ? "暫停" : remaining < total ? "繼續" : "開始"}
          </button>
          <button
            onClick={skip}
            className="h-11 rounded-full border-[1.5px] px-5 text-sm font-semibold transition hover:bg-white/40"
            style={{ borderColor: INK, color: INK }}
          >
            跳過
          </button>
        </div>
        <p className="mt-4 text-sm uppercase tracking-[0.2em]" style={{ color: MUTED }}>
          tip · space to start / pause
        </p>
      </section>

      {/* 側邊：任務、進度、設定 */}
      <div className="flex w-full max-w-md flex-col gap-5 lg:mt-12 lg:w-80">
        <section className={card} style={cardStyle}>
          <h2 className={heading}>now · 現在專注於</h2>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：寫企劃書第一章"
            className="w-full border-b-[1.5px] bg-transparent px-1 py-2 outline-none transition focus:border-[#9aae86]"
            style={{ borderColor: LINE, color: INK, fontFamily: ROUND }}
          />

          <div className="mt-5 flex items-center justify-between text-sm" style={{ fontFamily: ROUND }}>
            <span className="font-semibold">本輪進度</span>
            <span>
              已完成 <b style={{ color: MODE_COLOR.focus }}>{completed}</b> 顆 🍅
            </span>
          </div>
          <div className="mt-3 flex gap-3">
            {Array.from({ length: LONG_BREAK_EVERY }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
                <circle cx={12} cy={12} r={10} fill="none" stroke={MODE_COLOR.focus} strokeWidth={1.5} />
                <circle cx={12} cy={12} r={6.5} fill="none" stroke={MODE_COLOR.focus} strokeWidth={1.5} />
                {i < cycleDots && <circle cx={12} cy={12} r={10.5} fill={MODE_COLOR.focus} />}
              </svg>
            ))}
          </div>
          <p className="mt-3 text-xs" style={{ color: MUTED, fontFamily: ROUND }}>
            每完成 {LONG_BREAK_EVERY} 顆蕃茄會進入長休息
          </p>
        </section>

        <section className={card} style={cardStyle}>
          <h2 className={heading}>settings · 時間（分鐘）</h2>
          <div className="grid grid-cols-3 gap-3" style={{ fontFamily: ROUND }}>
            {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
              <label key={m} className="flex flex-col gap-1 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: MODE_COLOR[m] }} />
                  {MODE_LABEL[m]}
                </span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={minutes[m]}
                  disabled={running}
                  onChange={(e) => changeMinutes(m, Number(e.target.value))}
                  className="w-full rounded-2xl border-[1.5px] bg-white/30 px-3 py-1.5 text-base outline-none focus:border-[#9aae86] disabled:opacity-60"
                  style={{ borderColor: LINE, color: INK }}
                />
              </label>
            ))}
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm" style={{ fontFamily: ROUND }}>
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => setAutoStart(e.target.checked)}
              className="h-4 w-4 accent-[#9aae86]"
            />
            時間到自動開始下一段
          </label>
        </section>

        <section className={card} style={cardStyle}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl uppercase tracking-[0.2em]">log · 專注紀錄</h2>
            {log.length > 0 && (
              <button
                onClick={() => setLog([])}
                className="text-sm uppercase tracking-widest underline-offset-4 hover:underline"
                style={{ color: MUTED }}
              >
                clear
              </button>
            )}
          </div>
          {log.length === 0 ? (
            <p className="text-sm" style={{ color: MUTED, fontFamily: ROUND }}>
              完成第一顆蕃茄後會顯示在這裡
            </p>
          ) : (
            <ul className="max-h-48 space-y-2 overflow-y-auto" style={{ fontFamily: ROUND }}>
              {log.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span>🍅</span>
                  <span className="flex-1 truncate">{item.task}</span>
                  <span className="text-xs tabular-nums" style={{ color: MUTED }}>
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
