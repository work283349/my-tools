"use client";

import { useMemo, useState } from "react";

const NAVY = "#24215f";
const PINK = "#e8345c";
const PINK_LIGHT = "#ffe0e7";
const DIVIDER = "#d6d6de";

const SIZE = 400;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2;
const SPIN_MS = 5000;

// 角度以「從正上方順時針」計算
function point(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  // 四捨五入到小數兩位：避免伺服器與瀏覽器浮點數末位不同造成 hydration mismatch
  const round = (n: number) => Math.round(n * 100) / 100;
  return [round(CENTER + r * Math.sin(rad)), round(CENTER - r * Math.cos(rad))];
}

function slicePath(start: number, end: number) {
  const [x1, y1] = point(start, RADIUS);
  const [x2, y2] = point(end, RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function parseNames(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

const stripes = {
  backgroundImage: `repeating-linear-gradient(-45deg, ${PINK} 0 3px, transparent 3px 8px)`,
};

export default function LotteryWheel() {
  const [input, setInput] = useState("大獎一萬元\n二獎5000元\n三獎3000元\n四獎1000\n五獎500元\n參加獎100元");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const names = useMemo(() => parseNames(input), [input]);
  const n = names.length;
  const seg = n > 0 ? 360 / n : 360;
  const tangential = n <= 10;

  function spin() {
    if (spinning) return;

    // 若勾選「抽中後移除」，先把上一位得獎者從名單拿掉再抽
    let list = names;
    if (removeWinner && winner) {
      const lines = input.split("\n");
      const i = lines.findIndex((l) => l.trim() === winner);
      if (i >= 0) lines.splice(i, 1);
      const nextInput = lines.join("\n");
      setInput(nextInput);
      list = parseNames(nextInput);
    }
    setWinner(null);
    setWinnerIndex(null);
    if (list.length === 0) return;

    const s = 360 / list.length;
    const index = Math.floor(Math.random() * list.length);
    // 在該格內隨機停點（避開邊界）
    const offset = s * (0.15 + Math.random() * 0.7);
    const target = index * s + offset;
    const current = ((rotation % 360) + 360) % 360;
    const delta = 360 * 6 + ((360 - target - current + 720) % 360);
    setPendingIndex(index);
    setSpinning(true);
    setRotation(rotation + delta);
  }

  function handleSpinEnd() {
    if (!spinning || pendingIndex === null) return;
    const name = names[pendingIndex];
    setSpinning(false);
    setWinner(name);
    setWinnerIndex(pendingIndex);
    setHistory((h) => [name, ...h]);
    setPendingIndex(null);
  }

  const fontSize = tangential
    ? Math.max(13, Math.min(20, 150 / Math.max(n, 1)))
    : Math.max(9, Math.min(15, 260 / n));

  return (
    <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-10 xl:grid-cols-[18rem_minmax(0,1fr)_15rem]">
      {/* 名單輸入 */}
      <section className="order-2 w-full rounded-2xl border-2 bg-white p-5 shadow-[6px_6px_0_#24215f] xl:order-1" style={{ borderColor: NAVY }}>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold" style={{ color: NAVY }}>
          <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PINK }} />
          抽獎名單
        </h2>
        <textarea
          id="names"
          aria-label="抽獎名單，一行一位"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setWinner(null);
            setWinnerIndex(null);
          }}
          disabled={spinning}
          rows={11}
          className="w-full resize-y rounded-lg border-2 bg-[#f6f6f8] p-3 font-medium outline-none transition focus:border-[#e8345c] disabled:opacity-60"
          style={{ borderColor: DIVIDER, color: NAVY }}
          placeholder={"一行一位\n王小明\n李小華"}
        />
        <p className="mt-2 text-sm font-semibold" style={{ color: NAVY }}>
          共 <span style={{ color: PINK }}>{n}</span> 人・一行一位
        </p>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-medium" style={{ color: NAVY }}>
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            className="h-4 w-4 accent-[#e8345c]"
          />
          抽中後從名單移除（不重複中獎）
        </label>
      </section>

      {/* 轉盤 */}
      <section className="order-1 mx-auto flex w-full max-w-[440px] flex-col items-center md:col-span-2 xl:order-2 xl:col-span-1">
        <div className="relative aspect-square w-full">
          {/* 斜紋陰影 */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-full" style={stripes} />

          {/* 深藍外框 */}
          <div className="absolute inset-0 rounded-full p-[5%]" style={{ backgroundColor: NAVY }}>
            <div className="h-full w-full overflow-hidden rounded-full">
              <svg
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="block h-full w-full"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: spinning
                    ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                    : "none",
                }}
                onTransitionEnd={handleSpinEnd}
              >
                <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="#fff" />
                {n === 1 && winnerIndex === 0 && (
                  <circle cx={CENTER} cy={CENTER} r={RADIUS} fill={PINK_LIGHT} />
                )}
                {n > 1 &&
                  names.map((name, i) => (
                    <path
                      key={`s-${name}-${i}`}
                      d={slicePath(i * seg, (i + 1) * seg)}
                      fill={winnerIndex === i ? PINK_LIGHT : i % 2 === 0 ? "#ffffff" : "#f4f4f7"}
                      stroke={DIVIDER}
                      strokeWidth={1.5}
                    />
                  ))}

                {/* 內圈細線 */}
                <circle cx={CENTER} cy={CENTER} r={RADIUS * 0.36} fill="none" stroke={DIVIDER} strokeWidth={1.5} />

                {names.map((name, i) => {
                  const mid = i * seg + seg / 2;
                  const isWin = winnerIndex === i;
                  if (tangential) {
                    const [x, y] = point(mid, RADIUS * 0.82);
                    const [bx, by] = point(mid, RADIUS * 0.58);
                    const maxLen = n <= 6 ? 7 : 5;
                    const label = name.length > maxLen ? name.slice(0, maxLen - 1) + "…" : name;
                    return (
                      <g key={`t-${name}-${i}`}>
                        <text
                          x={x}
                          y={y}
                          fill={isWin ? PINK : NAVY}
                          fontSize={fontSize}
                          fontWeight={800}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${mid} ${x} ${y})`}
                        >
                          {label}
                        </text>
                        {/* 號碼徽章 */}
                        <g transform={`rotate(${mid} ${bx} ${by})`}>
                          <circle cx={bx} cy={by} r={17} fill={isWin ? PINK : "#fff"} stroke={NAVY} strokeWidth={2.5} />
                          <circle cx={bx + 3} cy={by + 3} r={17} fill="none" stroke={PINK} strokeWidth={1.5} strokeDasharray="3 3" />
                          <text
                            x={bx}
                            y={by + 1}
                            fill={isWin ? "#fff" : NAVY}
                            fontSize={15}
                            fontWeight={900}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {i + 1}
                          </text>
                        </g>
                      </g>
                    );
                  }
                  const [x, y] = point(mid, RADIUS * 0.66);
                  const label = name.length > 6 ? name.slice(0, 5) + "…" : name;
                  return (
                    <text
                      key={`t-${name}-${i}`}
                      x={x}
                      y={y}
                      fill={isWin ? PINK : NAVY}
                      fontSize={fontSize}
                      fontWeight={800}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${mid - 90} ${x} ${y})`}
                    >
                      {label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* 水滴指針 */}
          <svg
            viewBox="0 0 40 52"
            className="absolute left-1/2 top-0 z-20 w-[9%] -translate-x-1/2 -translate-y-[38%] drop-shadow-md"
            aria-hidden
          >
            <path d="M20 51 C20 51 3 30 3 19 A17 17 0 0 1 37 19 C37 30 20 51 20 51 Z" fill={PINK} />
            <circle cx={20} cy={19} r={7} fill="#fff" />
          </svg>

          {/* 中央開始按鈕 */}
          <button
            onClick={spin}
            disabled={spinning || n === 0}
            className="absolute left-1/2 top-1/2 z-20 flex aspect-square w-[27%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl font-black text-white shadow-[0_0_0_6px_#fff,0_0_0_8px_#d6d6de] transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100 sm:text-3xl"
            style={{ backgroundColor: PINK }}
          >
            {spinning ? (
              <span className="text-xl tracking-wider sm:text-2xl">抽獎中</span>
            ) : (
              "開始!"
            )}
          </button>
        </div>

        {/* 結果 */}
        <div className="mt-10 min-h-[5.5rem] text-center" aria-live="polite">
          {winner ? (
            <div className="rounded-2xl border-2 bg-white px-8 py-3 shadow-[6px_6px_0_#e8345c]" style={{ borderColor: NAVY }}>
              <p className="text-sm font-bold tracking-widest" style={{ color: NAVY }}>
                — 恭喜得獎者 —
              </p>
              <p className="text-4xl font-black" style={{ color: PINK }}>
                🎉 {winner} 🎉
              </p>
            </div>
          ) : (
            <p className="pt-4 text-sm font-semibold" style={{ color: NAVY }}>
              {n === 0
                ? "請先輸入抽獎名單"
                : spinning
                  ? "轉動中，祝你好運…"
                  : "按下中間的「開始!」抽出幸運兒"}
            </p>
          )}
        </div>
      </section>

      {/* 中獎紀錄 */}
      <section className="order-3 w-full self-stretch rounded-2xl border-2 bg-white p-5 shadow-[6px_6px_0_#24215f] xl:self-start" style={{ borderColor: NAVY }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold" style={{ color: NAVY }}>
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: PINK }} />
            中獎紀錄
          </h2>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="text-sm font-semibold underline-offset-2 hover:underline"
              style={{ color: PINK }}
            >
              清除
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="text-sm" style={{ color: "#6b6a8f" }}>
            尚未抽獎
          </p>
        ) : (
          <ol className="space-y-2">
            {history
              .slice()
              .reverse()
              .map((name, i) => (
                <li key={i} className="flex items-center gap-3 font-bold" style={{ color: NAVY }}>
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs text-white"
                    style={{ backgroundColor: i === history.length - 1 ? PINK : NAVY }}
                  >
                    {i + 1}
                  </span>
                  {name}
                </li>
              ))}
          </ol>
        )}
      </section>
    </div>
  );
}
