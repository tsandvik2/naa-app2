"use client";

import Link from "next/link";
import { useAppStore } from "@/store/app-store";

export function AppHeader() {
  const profile = useAppStore((s) => s.profile);

  return (
    <header className="pt-12 pb-1.5 flex items-end justify-between">
      <div>
        <div
          className="gradient-text-white"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 62,
            lineHeight: 0.9,
            letterSpacing: 2,
          }}
        >
          NÅ
        </div>
        <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#55556a] mt-1">
          Hva gjør vi nå?
        </div>
      </div>

      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-full px-3.5 py-1.5 pl-2 cursor-pointer transition-all active:scale-95"
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.063)",
        }}
      >
        <span className="text-xl">{profile.emoji}</span>
        <div>
          <div className="text-xs font-bold text-[rgba(235,235,245,0.8)]">
            {profile.name || "–"}
          </div>
          <div className="text-[11px] font-bold text-[#ffd60a]">
            {profile.pts} pts
          </div>
        </div>
      </Link>
    </header>
  );
}
