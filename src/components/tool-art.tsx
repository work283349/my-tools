import { Ribbon } from "@/app/pomodoro/ribbon";

/* 首頁用的三個工具縮圖插畫（純 SVG，不含互動） */

export function WheelArt({ className }: { className?: string }) {
  const NAVY = "#24215f";
  const PINK = "#e8345c";
  const n = 8;
  const r = 90;
  const slices = Array.from({ length: n }).map((_, i) => {
    const a1 = ((i * 360) / n - 90) * (Math.PI / 180);
    const a2 = (((i + 1) * 360) / n - 90) * (Math.PI / 180);
    return {
      d: `M100 100 L ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${100 + r * Math.cos(a2)} ${100 + r * Math.sin(a2)} Z`,
      fill: i % 2 === 0 ? "#ffffff" : "#f1f1f5",
    };
  });
  return (
    <svg viewBox="-6 -14 222 226" className={className} aria-hidden>
      <circle cx={108} cy={108} r={100} fill="none" stroke={PINK} strokeWidth={6} strokeDasharray="2 5" />
      <circle cx={100} cy={100} r={100} fill={NAVY} />
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.fill} stroke="#d6d6de" strokeWidth={1} />
      ))}
      {slices.map((_, i) => {
        const a = (((i + 0.5) * 360) / n - 90) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={100 + 62 * Math.cos(a)}
            cy={100 + 62 * Math.sin(a)}
            r={8}
            fill={i === 2 ? PINK : "#fff"}
            stroke={NAVY}
            strokeWidth={2}
          />
        );
      })}
      <circle cx={100} cy={100} r={30} fill={PINK} stroke="#fff" strokeWidth={5} />
      <text x={100} y={106} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff">
        GO!
      </text>
      <path d="M100 18 C100 18 88 4 88 -3 A12 12 0 0 1 112 -3 C112 4 100 18 100 18 Z" fill={PINK} />
      <circle cx={100} cy={-3} r={4.5} fill="#fff" />
    </svg>
  );
}

export function RibbonArt({ className }: { className?: string }) {
  const R = 78;
  const C = 2 * Math.PI * R;
  const ring = `M 100 ${100 - R} A ${R} ${R} 0 1 1 99.99 ${100 - R}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g opacity={0.3}>
        <Ribbon d={ring} color="#9aae86" width={26} lines={3} />
      </g>
      <Ribbon
        d={ring}
        color="#9aae86"
        width={26}
        lines={3}
        strokeDasharray={C}
        strokeDashoffset={C * 0.32}
      />
      <text
        x={100}
        y={112}
        textAnchor="middle"
        fontSize={38}
        fill="#35342e"
        style={{ fontFamily: "ui-rounded, 'Arial Rounded MT Bold', sans-serif" }}
        fontWeight={700}
      >
        25:00
      </text>
      <text x={100} y={136} textAnchor="middle" fontSize={9} letterSpacing={3} fill="#7d786c">
        FOCUS
      </text>
    </svg>
  );
}

export function OmikujiArt({ className }: { className?: string }) {
  return (
    <svg viewBox="-20 -50 280 420" className={className} aria-hidden>
      <g transform="rotate(18 120 200)">
        <rect x={111} y={-30} width={18} height={110} rx={2} fill="#d9b77e" stroke="#b8935a" />
        <rect x={111} y={-30} width={18} height={10} rx={2} fill="#d8392b" />
        <polygon points="50,70 80,88 80,348 50,330" fill="#e3b073" />
        <polygon points="80,88 160,88 160,348 80,348" fill="#f0c48a" />
        <polygon points="160,88 190,70 190,330 160,348" fill="#d39d5e" />
        <polygon points="50,70 80,88 80,108 50,90" fill="#c23125" />
        <polygon points="80,88 160,88 160,108 80,108" fill="#d8392b" />
        <polygon points="160,88 190,70 190,90 160,108" fill="#a8281e" />
        <polygon points="50,306 80,324 80,348 50,330" fill="#c23125" />
        <polygon points="80,324 160,324 160,348 80,348" fill="#d8392b" />
        <polygon points="160,324 190,306 190,330 160,348" fill="#a8281e" />
        <polygon points="50,70 80,52 160,52 190,70 160,88 80,88" fill="#f6d29c" />
        <ellipse cx={120} cy={70} rx={15} ry={8} fill="#5b3b1f" />
        <rect x={111} y={40} width={18} height={30} fill="#d9b77e" stroke="#b8935a" />
        {["大", "吉"].map((ch, i) => (
          <text
            key={ch}
            x={120}
            y={180 + i * 58}
            textAnchor="middle"
            fontSize={48}
            fontWeight={900}
            fill="#2b2622"
            style={{ fontFamily: "var(--font-display), serif" }}
          >
            {ch}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function ToolboxLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x={3} y={11} width={26} height={17} rx={4} fill="currentColor" />
      <path d="M11 11 V8 a3 3 0 0 1 3-3 h4 a3 3 0 0 1 3 3 V11" fill="none" stroke="currentColor" strokeWidth={2.5} />
      <rect x={3} y={17} width={26} height={2.5} fill="var(--logo-band, #f7f4ee)" />
      <rect x={13.5} y={15.5} width={5} height={5.5} rx={1.2} fill="#e8345c" />
    </svg>
  );
}
