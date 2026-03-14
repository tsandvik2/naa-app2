"use client";

import type { SelectedChallenge } from "@/lib/challenges/data";

interface ChallengeCardProps {
  challenge: SelectedChallenge;
  showGlow?: boolean;
}

const LEVEL_STYLES = {
  easy: { bg: "rgba(0,199,255,.1)", color: "#00f0ff", label: "🟢 LETT" },
  medium: { bg: "rgba(255,214,10,.1)", color: "#ffd60a", label: "🟡 MEDIUM" },
  wild: { bg: "rgba(255,45,85,.12)", color: "#ff2d55", label: "🔴 VILL" },
  safe: { bg: "rgba(0,230,118,.1)", color: "#00e676", label: "🟢 TRYGT" },
};

const CATEGORY_EMOJIS: Record<string, string> = {
  kreativ: "🎨",
  sosial: "👥",
  fysisk: "🏃",
  kaos: "💥",
  video: "🎥",
};

export function ChallengeCard({ challenge, showGlow = true }: ChallengeCardProps) {
  const level = LEVEL_STYLES[challenge.difficulty];

  return (
    <div className="relative my-1">
      {showGlow && (
        <div
          className="absolute inset-[-2px] rounded-[23px] z-0"
          style={{
            background: "linear-gradient(135deg, #ff2d55, #ff6b00, #ffd60a)",
            opacity: 0.4,
            filter: "blur(10px)",
            animation: "glowPulse 3s ease-in-out infinite",
          }}
        />
      )}
      <div
        className="relative z-10 rounded-[22px] overflow-hidden"
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="rainbow-stripe" />
        <div className="p-5 pt-[22px]">
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest uppercase rounded-full px-3 py-1 mb-3.5"
            style={{ background: level.bg, color: level.color }}
          >
            {level.label}
          </div>
          <div className="text-xl font-extrabold leading-[1.35] mb-4 text-white">
            {challenge.text}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span
              className="text-[11px] text-[#55556a] rounded-lg px-2.5 py-1 font-semibold"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {CATEGORY_EMOJIS[challenge.cat] ?? "🎯"} {challenge.cat}
            </span>
            {challenge.cam && (
              <span
                className="text-[11px] text-[#00f0ff] rounded-lg px-2.5 py-1 font-semibold"
                style={{ background: "rgba(0,240,255,0.08)" }}
              >
                📸 Krever bevis
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
