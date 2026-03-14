"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";
import { AVATARS, generateFriendCode } from "@/lib/challenges/data";
import { createClient } from "@/lib/supabase/client";

interface OnboardingProps {
  userId: string;
}

export function Onboarding({ userId }: OnboardingProps) {
  const router = useRouter();
  const { setProfile, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🔥");
  const [selectedAge, setSelectedAge] = useState("");
  const [saving, setSaving] = useState(false);

  const ageGroups = [
    { value: "13-15", emoji: "🧒", label: "13–15 år", sub: "Trygt & gøy" },
    { value: "16-19", emoji: "🧑", label: "16–19 år", sub: "Litt kaos" },
    { value: "20+", emoji: "👤", label: "20+ år", sub: "Full galskap" },
  ];

  async function handleFinish() {
    if (!name.trim()) {
      toast.error("Skriv inn et kallenavn");
      return;
    }
    if (!selectedAge) {
      toast.error("Velg aldersgruppe");
      return;
    }

    setSaving(true);
    const friendCode = generateFriendCode();

    try {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({
          username: name.trim(),
          avatar_url: selectedAvatar,
          age_group: selectedAge,
          friend_code: friendCode,
        })
        .eq("id", userId);

      setProfile({
        name: name.trim(),
        emoji: selectedAvatar,
        ageGroup: selectedAge,
        friendCode,
      });
      completeOnboarding();
      router.push("/home");
    } catch (err) {
      console.error(err);
      // Still save locally and proceed
      setProfile({
        name: name.trim(),
        emoji: selectedAvatar,
        ageGroup: selectedAge,
        friendCode,
      });
      completeOnboarding();
      router.push("/home");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen bg-black px-5 pb-12 overflow-y-auto"
      style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Mesh bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(255,45,85,.45), transparent 70%)",
            top: -150, left: -100,
            filter: "blur(90px)", opacity: 0.22,
            animation: "d1 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            background: "radial-gradient(circle, rgba(0,240,255,.18), transparent 70%)",
            bottom: -100, right: -80,
            filter: "blur(90px)", opacity: 0.22,
            animation: "d2 15s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        {step === 0 && (
          <div
            className="flex flex-col items-center gap-6 w-full"
            style={{ animation: "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div
              className="gradient-text-logo"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 100,
                letterSpacing: 4,
                lineHeight: 1,
              }}
            >
              NÅ
            </div>
            <p className="text-lg font-bold text-[rgba(235,235,245,0.8)] text-center leading-relaxed">
              Slutt å scrolle.<br />Begynn å leve.
            </p>

            <div className="flex flex-col gap-2.5 w-full">
              {[
                { icon: "🎯", title: "Utfordringer tilpasset deg", desc: "Basert på humør, tid og antall" },
                { icon: "👯", title: "Spill mot venner", desc: "Send kode på Snapchat – taperen får straffen" },
                { icon: "🔥", title: "Bygg streak og klatr på lista", desc: "Samle poeng, lås opp badges, bli #1" },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex items-center gap-3.5 rounded-2xl p-3.5"
                  style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.063)" }}
                >
                  <div className="text-3xl flex-shrink-0">{f.icon}</div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">{f.title}</div>
                    <div className="text-xs text-[#55556a]">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex gap-1.5">
              <div className="w-6 h-2 rounded bg-[#ff2d55]" />
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-[17px] rounded-2xl text-white font-extrabold text-base active:scale-[0.97] transition-all"
              style={{
                background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
                boxShadow: "0 8px 32px rgba(255,45,85,0.45), 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              Kom i gang →
            </button>
          </div>
        )}

        {step === 1 && (
          <div
            className="flex flex-col items-center gap-5 w-full"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 1 }}
              className="text-white text-center"
            >
              Hvem er du? 👋
            </div>
            <p className="text-sm text-[#55556a] -mt-3 text-center">Vi tilpasser appen for deg</p>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-[#55556a] uppercase tracking-wider">Ditt kallenavn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(2)}
                placeholder="Skriv navnet ditt..."
                maxLength={20}
                autoComplete="off"
                className="w-full px-4 py-4 rounded-2xl text-white font-bold text-lg outline-none transition-all placeholder:text-[#55556a]"
                style={{
                  background: "#111118",
                  border: "1.5px solid rgba(255,255,255,0.063)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#ff2d55")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.063)")}
              />
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-bold text-[#55556a] uppercase tracking-wider">Velg din avatar</label>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATARS.map((av) => (
                  <button
                    key={av.em}
                    onClick={() => setSelectedAvatar(av.em)}
                    className="rounded-2xl py-3 px-1.5 cursor-pointer transition-all active:scale-[0.92] flex flex-col items-center gap-1 text-center"
                    style={{
                      background: "#111118",
                      border: `1.5px solid ${selectedAvatar === av.em ? "#ff2d55" : "rgba(255,255,255,0.063)"}`,
                    }}
                  >
                    <span className="text-[28px] leading-none block">{av.em}</span>
                    <span className="text-[9px] font-bold text-[#55556a] leading-tight">{av.label}</span>
                    <span className="text-[8px] text-[#55556a] opacity-70">{av.vibe}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="w-6 h-2 rounded bg-[#ff2d55]" />
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            <button
              onClick={() => name.trim() && setStep(2)}
              className="w-full py-[17px] rounded-2xl text-white font-extrabold text-base active:scale-[0.97] transition-all"
              style={{
                background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
                boxShadow: "0 8px 32px rgba(255,45,85,0.45)",
                opacity: name.trim() ? 1 : 0.5,
              }}
            >
              Neste →
            </button>
          </div>
        )}

        {step === 2 && (
          <div
            className="flex flex-col items-center gap-6 w-full"
            style={{ animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: 1 }}
              className="text-white text-center"
            >
              Hvor gammel er du? 🎂
            </div>
            <p className="text-sm text-[#55556a] -mt-3 text-center">
              Aldersgruppen avgjør hvilke utfordringer du får
            </p>

            <div className="grid grid-cols-3 gap-2 w-full">
              {ageGroups.map((ag) => (
                <button
                  key={ag.value}
                  onClick={() => setSelectedAge(ag.value)}
                  className="rounded-2xl py-4 px-2.5 text-sm font-bold cursor-pointer text-center transition-all"
                  style={{
                    background: selectedAge === ag.value ? "rgba(255,45,85,.14)" : "#111118",
                    border: `1.5px solid ${selectedAge === ag.value ? "#ff2d55" : "rgba(255,255,255,0.063)"}`,
                    color: selectedAge === ag.value ? "#fff" : "rgba(235,235,245,0.8)",
                  }}
                >
                  <span className="text-2xl block mb-1.5">{ag.emoji}</span>
                  {ag.label}
                  <br />
                  <span className="text-[10px] text-[#55556a] font-semibold">{ag.sub}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
              <div className="w-6 h-2 rounded bg-[#ff2d55]" />
            </div>

            <button
              onClick={handleFinish}
              disabled={!selectedAge || saving}
              className="w-full py-[17px] rounded-2xl text-white font-extrabold text-base active:scale-[0.97] transition-all disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
                boxShadow: "0 8px 32px rgba(255,45,85,0.45)",
              }}
            >
              {saving ? "Lagrer..." : "Kom i gang! 🚀"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3.5 rounded-2xl font-bold text-[15px] text-[#55556a] transition-all active:scale-[0.97]"
              style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              ← Tilbake
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
