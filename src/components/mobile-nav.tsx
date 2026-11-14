"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { href: string; name: string; en: string; accent: string };

export default function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  // 開啟時鎖住背景捲動，按 Esc 關閉
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "關閉選單" : "開啟選單"}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1b19] text-[#f7f4ee]"
      >
        <span
          className="absolute h-[2px] w-4 bg-current transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
        />
        <span
          className="absolute h-[2px] w-4 bg-current transition-transform duration-300"
          style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
        />
      </button>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-[#f7f4ee] px-5 pt-6 transition duration-300 ${
          open ? "visible opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col">
          {items.map((t, i) => (
            <Link
              key={t.href}
              href={t.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-[#e3ddd2] py-5"
            >
              <span className="flex items-center gap-4">
                <span className="text-sm font-bold" style={{ color: t.accent }}>
                  0{i + 1}
                </span>
                <span className="text-2xl font-black" style={{ fontFamily: "var(--font-display), serif" }}>
                  {t.name}
                </span>
              </span>
              <span className="text-xs font-semibold tracking-[0.2em] text-[#6f6a63]">
                {t.en.toUpperCase()}
              </span>
            </Link>
          ))}
        </nav>
        <a
          href="#tools"
          onClick={() => setOpen(false)}
          className="mt-8 flex h-12 items-center justify-center rounded-full bg-[#1d1b19] font-semibold text-[#f7f4ee]"
        >
          瀏覽所有工具
        </a>
      </div>
    </div>
  );
}
