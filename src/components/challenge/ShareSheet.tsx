"use client";

import { useRef, useEffect } from "react";
import { toast } from "sonner";

interface ShareSheetProps {
  challengeText: string;
  username: string;
  photoUrl?: string | null;
  pts: number;
  onNext: () => void;
}

export function ShareSheet({ challengeText, username, photoUrl, pts, onNext }: ShareSheetProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger confetti
    spawnConfetti();
  }, []);

  function spawnConfetti() {
    const colors = ["#ff2d55", "#ff6b00", "#ffd60a", "#00e676", "#00f0ff"];
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const el = document.createElement("div");
        el.style.cssText = `
          position:fixed;left:${Math.random()*100}%;top:-10px;
          width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
          background:${colors[Math.floor(Math.random()*colors.length)]};
          border-radius:${Math.random()>0.5?'50%':'2px'};
          animation:fall ${1.5+Math.random()*1.2}s ease-in forwards;
          z-index:489;pointer-events:none;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
      }, i * 30);
    }
  }

  async function quickShare(platform: "snap" | "insta" | "tiktok" | "sms") {
    const text = `Jeg fullførte NÅ-utfordringen: "${challengeText}" 🔥 Last ned NÅ-appen!`;

    if (platform === "snap") {
      // Deep link to Snapchat camera with clipboard
      await navigator.clipboard?.writeText(text).catch(() => {});
      window.location.href = "snapchat://";
      setTimeout(() => {
        if (document.hidden) return;
        toast.info("Åpner Snapchat — lim inn teksten!");
      }, 1000);
    } else if (platform === "insta") {
      await navigator.clipboard?.writeText(text).catch(() => {});
      window.location.href = "instagram://camera";
      setTimeout(() => {
        if (document.hidden) return;
        toast.info("Åpner Instagram — lim inn teksten!");
      }, 1000);
    } else if (platform === "tiktok") {
      await navigator.clipboard?.writeText(text).catch(() => {});
      window.location.href = "tiktok://";
      setTimeout(() => {
        if (document.hidden) return;
        toast.info("Åpner TikTok — lim inn teksten!");
      }, 1000);
    } else if (platform === "sms") {
      window.location.href = `sms:?body=${encodeURIComponent(text)}`;
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "NÅ – Utfordring fullført!",
          text: `Jeg fullførte: "${challengeText}" 🔥`,
          url: window.location.origin,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard?.writeText(
        `Jeg fullførte NÅ-utfordringen: "${challengeText}" 🔥`
      );
      toast.success("Kopiert til utklippstavle!");
    }
  }

  return (
    <div
      className="rounded-[20px] p-5 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0a0e, #0a0a1a)",
        border: "1.5px solid rgba(255,45,85,.2)",
        animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
      ref={cardRef}
    >
      <div className="rainbow-stripe absolute top-0 left-0 right-0" />

      <div className="text-[40px] mb-2 mt-1">🎉</div>
      <div
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1 }}
        className="mb-1"
      >
        FULLFØRT!
      </div>
      <div className="text-sm text-[#55556a] mb-4">
        {username || "Du"} er en legende! 🔥
      </div>

      {photoUrl && (
        <div className="mb-4 rounded-2xl overflow-hidden">
          <img
            src={photoUrl}
            alt="Bevis"
            className="w-full object-cover max-h-48"
          />
        </div>
      )}

      <div className="text-sm font-bold leading-relaxed text-[rgba(235,235,245,0.8)] mb-4">
        &ldquo;{challengeText}&rdquo;
      </div>

      <div
        className="gradient-text-pts"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, lineHeight: 1 }}
      >
        {pts}
      </div>
      <div className="text-xs text-[#55556a] font-bold uppercase tracking-wider mb-4">
        POENG TOTALT
      </div>

      {/* Social share */}
      <div className="mt-4">
        <div className="text-sm font-extrabold text-white mb-1">📲 Del på sosiale medier</div>
        <div className="text-xs text-[#55556a] mb-3">Vis verden hva du har gjort!</div>

        <div className="flex gap-2.5 justify-center">
          {[
            { id: "tiktok" as const, icon: "🎵", label: "TikTok", bg: "linear-gradient(135deg,#010101,#1a1a2e)", color: "#fff" },
            { id: "snap" as const, icon: "👻", label: "Snapchat", bg: "linear-gradient(135deg,#fffc00,#ffd000)", color: "#000" },
            { id: "insta" as const, icon: "📸", label: "Reels", bg: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fff" },
            { id: "sms" as const, icon: "💬", label: "SMS", bg: "linear-gradient(135deg,#30d158,#00a86b)", color: "#fff" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => quickShare(s.id)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2.5 rounded-2xl border-none cursor-pointer transition-all active:scale-[0.93] font-jakarta"
              style={{ background: s.bg }}
            >
              <span className="text-[26px]">{s.icon}</span>
              <span className="text-[11px] font-extrabold" style={{ color: s.color }}>{s.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNativeShare}
          className="w-full mt-2.5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.97]"
          style={{
            background: "rgba(255,255,255,.07)",
            border: "1.5px solid rgba(255,255,255,.12)",
            color: "rgba(255,255,255,.7)",
          }}
        >
          🔗 Kopier / Del
        </button>
      </div>

      <div className="flex items-center gap-2 my-4">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.06)" }} />
        <span className="text-xs text-[#55556a]">— eller —</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,.06)" }} />
      </div>

      <div className="text-sm font-extrabold text-white mb-1">👯 Utfordre en venn!</div>
      <div className="text-xs text-[#55556a] mb-3">Send utfordringen direkte</div>

      <div className="flex gap-2.5 justify-center mb-4">
        <button
          onClick={() => quickShare("snap")}
          className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-none cursor-pointer transition-all active:scale-[0.93]"
          style={{ background: "linear-gradient(135deg,#fffc00,#ffd000)" }}
        >
          <span className="text-[26px]">👻</span>
          <span className="text-[11px] font-extrabold text-black">Send på Snap</span>
        </button>
        <button
          onClick={() => quickShare("sms")}
          className="flex-1 flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-none cursor-pointer transition-all active:scale-[0.93]"
          style={{ background: "linear-gradient(135deg,#30d158,#00a86b)" }}
        >
          <span className="text-[26px]">💬</span>
          <span className="text-[11px] font-extrabold text-white">Send SMS</span>
        </button>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-white font-extrabold text-base active:scale-[0.97] transition-all"
        style={{
          background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
          boxShadow: "0 8px 32px rgba(255,45,85,0.45)",
        }}
      >
        Neste utfordring 🎯
      </button>
    </div>
  );
}
