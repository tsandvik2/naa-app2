"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";
import { pickChallenge } from "@/lib/challenges/data";
import { Onboarding } from "@/components/challenge/Onboarding";
import { WizardChip } from "@/components/challenge/WizardChip";
import { ChallengeCard } from "@/components/challenge/ChallengeCard";
import { CameraCapture } from "@/components/challenge/CameraCapture";
import { ShareSheet } from "@/components/challenge/ShareSheet";
import { FriendSelector } from "@/components/challenge/FriendSelector";
import { PunishmentScreen } from "@/components/challenge/PunishmentScreen";
import { AppHeader } from "@/components/layout/AppHeader";
import { LoadingDots } from "@/components/shared/LoadingDots";
import { createClient } from "@/lib/supabase/client";

interface HomeClientProps {
  userId: string;
}

type AppScreen =
  | "setup"
  | "loading"
  | "reveal"
  | "countdown"
  | "flip"
  | "challenge"
  | "punishment"
  | "done";

const LOAD_MESSAGES = [
  "Finner noe gøyalt...",
  "Sjekker humøret ditt...",
  "Matcher deg med den perfekte utfordringen...",
  "Nesten klar...",
];

export function HomeClient({ userId }: HomeClientProps) {
  const router = useRouter();
  const {
    profile,
    wizard,
    currentChallenge,
    proofPhotoUrl,
    hasShared,
    onboardingComplete,
    setWizardMood,
    setWizardTime,
    setWizardPlayers,
    setWizardStep,
    setSelectedFriends,
    resetWizard,
    setCurrentChallenge,
    setProofPhotoUrl,
    setHasShared,
    completeChallenge,
  } = useAppStore();

  const [screen, setScreen] = useState<AppScreen>("setup");
  const [loadMsg, setLoadMsg] = useState(LOAD_MESSAGES[0]);
  const [countNum, setCountNum] = useState(3);
  const [flipped, setFlipped] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showProofCamera, setShowProofCamera] = useState(false);
  const [hasProof, setHasProof] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMax, setTimerMax] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [groupSessionId, setGroupSessionId] = useState<string | null>(null);

  const currentStep = wizard.step;
  const isGroup = currentChallenge?.isGroup ?? false;
  const isSolo = !isGroup;

  // Timer logic
  useEffect(() => {
    if (!timerActive) return;
    if (timerSeconds <= 0) {
      setTimerActive(false);
      setTimerExpired(true);
      return;
    }
    const id = setTimeout(() => setTimerSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [timerActive, timerSeconds]);

  function startChallenge() {
    // Use getState() to always get fresh wizard values
    const state = useAppStore.getState();
    const w = state.wizard;
    const age = state.profile.ageGroup;

    if (!w.mood || !w.time || !w.players) {
      toast.error("Velg alle alternativene først");
      return;
    }

    const challenge = pickChallenge({
      mood: w.mood,
      time: w.time,
      players: w.players,
      ageGroup: age,
    });
    setCurrentChallenge(challenge);
    setHasProof(false);
    setProofPhotoUrl(null);
    setHasShared(false);

    // Show loading
    setScreen("loading");
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOAD_MESSAGES.length;
      setLoadMsg(LOAD_MESSAGES[msgIdx]);
    }, 600);

    setTimeout(() => {
      clearInterval(msgInterval);
      setScreen("reveal");
    }, 2000);
  }

  function startRevealCountdown() {
    setScreen("countdown");
    setCountNum(3);
    let n = 3;
    const id = setInterval(() => {
      n--;
      setCountNum(n);
      if (n <= 0) {
        clearInterval(id);
        setScreen("flip");
        setFlipped(false);
        setTimeout(() => {
          setFlipped(true);
        }, 400);
      }
    }, 1000);
  }

  function goToChallenge() {
    setScreen("challenge");
    if (currentChallenge) {
      const secs = currentChallenge.timeMinutes * 60;
      setTimerMax(secs);
      setTimerSeconds(secs);
      setTimerActive(true);
    }
  }

  function handleProofCaptured(photoDataUrl: string) {
    setProofPhotoUrl(photoDataUrl);
    setHasProof(true);
    setShowProofCamera(false);
    toast.success("Bevis tatt! 📸");
  }

  async function handleShareToSocial(platform: "snap" | "insta" | "native") {
    const text = `Jeg fullførte NÅ-utfordringen: "${currentChallenge?.text}" 🔥 Last ned NÅ-appen!`;

    // Try native share with image first (works great on mobile)
    if (platform === "native" || (navigator.share && proofPhotoUrl)) {
      try {
        const shareData: ShareData = {
          title: "NÅ – Utfordring fullført!",
          text,
        };

        // Try to share image file if we have proof
        if (proofPhotoUrl) {
          try {
            const blob = await fetch(proofPhotoUrl).then((r) => r.blob());
            const file = new File([blob], "na-bevis.jpg", { type: "image/jpeg" });
            if (navigator.canShare?.({ files: [file] })) {
              shareData.files = [file];
            }
          } catch {
            // Image share not supported, share text only
          }
        }

        await navigator.share(shareData);
        setHasShared(true);
        toast.success("Delt! Marker som fullført 🎉");
        return;
      } catch {
        // User cancelled or share failed, fall through to deep link
      }
    }

    // Fallback: copy text + open app
    await navigator.clipboard?.writeText(text).catch(() => {});
    setHasShared(true);

    if (platform === "snap") {
      window.open("snapchat://", "_blank");
    } else if (platform === "insta") {
      window.open("instagram://camera", "_blank");
    }

    toast.success("Tekst kopiert! Del det i appen 📲");
  }

  async function handleComplete() {
    if (!currentChallenge) return;

    // Solo: require photo proof for cam challenges
    if (isSolo && currentChallenge.cam && !hasProof) {
      toast.error("Ta bevisbildet først 📸");
      return;
    }

    // Solo: require sharing
    if (isSolo && !hasShared) {
      toast.error("Del på Snap eller Insta først! 📲");
      return;
    }

    setTimerActive(false);

    // Upload proof photo if we have one
    let uploadedUrl: string | null = null;
    if (proofPhotoUrl && userId) {
      try {
        const supabase = createClient();
        const blob = await fetch(proofPhotoUrl).then((r) => r.blob());
        const fileName = `${userId}/${Date.now()}.jpg`;
        const { data } = await supabase.storage
          .from("proofs")
          .upload(fileName, blob, { contentType: "image/jpeg" });
        if (data) {
          const { data: urlData } = supabase.storage
            .from("proofs")
            .getPublicUrl(fileName);
          uploadedUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    // Group challenge: create group session and show punishment
    if (isGroup) {
      try {
        const supabase = createClient();
        const participantIds = wizard.selectedFriends.map((f) => f.id);

        const { data: session } = await supabase
          .from("group_sessions")
          .insert({
            host_id: userId,
            challenge_text: currentChallenge.text,
            challenge_difficulty: currentChallenge.difficulty,
            participant_ids: participantIds,
            punishment_text: currentChallenge.punishment,
            proof_url: uploadedUrl,
            pts_earned: 10,
          })
          .select("id")
          .single();

        if (session) {
          setGroupSessionId(session.id);
        }
      } catch (err) {
        console.error("Group session error:", err);
      }

      // If there's a punishment, show the punishment screen
      if (currentChallenge.punishment && wizard.selectedFriends.length > 0) {
        completeChallenge(10, currentChallenge.text, currentChallenge.cat === "kreativ" ? "🎨" : "🎯");
        setScreen("punishment");
        return;
      }
    }

    // Solo: save completion to Supabase
    if (isSolo && userId) {
      try {
        const supabase = createClient();
        await supabase.from("completions").insert({
          user_id: userId,
          challenge_text: currentChallenge.text,
          photo_url: uploadedUrl,
          pts_earned: 10,
        });
        await supabase
          .from("profiles")
          .update({ pts: profile.pts + 10, done_count: profile.done + 1 })
          .eq("id", userId);
      } catch (err) {
        console.error("Save completion error:", err);
      }
    }

    completeChallenge(10, currentChallenge.text, currentChallenge.cat === "kreativ" ? "🎨" : "🎯");
    setScreen("done");
  }

  async function handlePunishmentConfirm(loserId: string | null) {
    // Call the RPC to complete the group session and award points to all
    if (groupSessionId) {
      try {
        const supabase = createClient();
        await supabase.rpc("complete_group_session", {
          session_id: groupSessionId,
          loser: loserId,
          proof: proofPhotoUrl,
        });
      } catch (err) {
        console.error("Complete group session error:", err);
        // Fallback: update host manually if RPC fails
      }
    }
    setScreen("done");
  }

  function handlePunishmentSkip() {
    handlePunishmentConfirm(null);
  }

  function skipChallenge() {
    const newPts = Math.max(0, profile.pts - 5);
    useAppStore.getState().setProfile({ pts: newPts });
    toast.info("Utfordring hoppet over (-5 pts)");
    resetWizard();
    setScreen("setup");
    setTimerActive(false);
  }

  function backToSetup() {
    resetWizard();
    setScreen("setup");
    setTimerActive(false);
    setTimerExpired(false);
  }

  function nextChallenge() {
    resetWizard();
    setScreen("setup");
    setTimerExpired(false);
  }

  // Not onboarded yet
  if (!onboardingComplete || !profile.name) {
    return <Onboarding userId={userId} />;
  }

  return (
    <div style={{ animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1)" }}>
      <AppHeader />

      {/* ── SETUP WIZARD ── */}
      {screen === "setup" && (
        <div className="flex flex-col gap-3.5 mt-3.5">
          {/* Daily card */}
          <div
            className="rounded-[18px] px-[18px] py-4 relative overflow-hidden"
            style={{
              background: "#111118",
              border: "1.5px solid rgba(255,255,255,0.063)",
            }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px]"
              style={{ background: "linear-gradient(180deg, #ff2d55, #ff6b00)" }}
            />
            <div className="flex items-center justify-between mb-2 pl-2">
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#ff2d55]">
                📅 Dagens utfordring
              </div>
              <div className="text-[11px] font-bold text-[#55556a] bg-white/5 rounded-lg px-2.5 py-0.5">
                {new Date().toLocaleDateString("no", { weekday: "long", day: "numeric", month: "short" })}
              </div>
            </div>
            <div className="text-sm font-bold leading-relaxed mb-2.5 pl-2">
              Hils på tre nye mennesker i dag – si noe genuint hyggelig til hver 👋
            </div>
            <button
              className="rounded-[10px] px-4 py-2 text-[13px] font-extrabold text-white border-none cursor-pointer"
              style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b00)" }}
              onClick={() => router.push("/today")}
            >
              Se dagens →
            </button>
          </div>

          {/* Wizard steps progress */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[3px] rounded-full transition-all duration-300"
                style={{
                  flex: currentStep === i ? 2.5 : 1,
                  display: i === 3 && currentStep < 3 ? "none" : "block",
                  background:
                    currentStep > i
                      ? "#00e676"
                      : currentStep === i
                        ? "linear-gradient(90deg, #ff2d55, #ff6b00)"
                        : "rgba(255,255,255,0.063)",
                }}
              />
            ))}
          </div>

          {/* Step 0: Mood */}
          {currentStep === 0 && (
            <div style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
              <div
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 0.5, lineHeight: 1.1 }}
                className="text-white"
              >
                Hvordan har du det? 👀
              </div>
              <p className="text-sm text-[#55556a] font-semibold mt-0.5 mb-3">Velg ett alternativ</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: "⚡", label: "Energisk", value: "Energisk" },
                  { emoji: "😌", label: "Avslappet", value: "Avslappet" },
                  { emoji: "😑", label: "Lei meg", value: "Lei og rastløs" },
                  { emoji: "🤪", label: "Full kaos", value: "Klar for galskap" },
                ].map((opt, i) => (
                  <WizardChip
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={wizard.mood === opt.value}
                    onClick={() => setWizardMood(opt.value)}
                    animationDelay={`${i * 0.4}s`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Time */}
          {currentStep === 1 && (
            <div style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
              <div
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 0.5, lineHeight: 1.1 }}
                className="text-white"
              >
                Hvor mye tid? ⏱
              </div>
              <p className="text-sm text-[#55556a] font-semibold mt-0.5 mb-3">Velg ett alternativ</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: "⚡", label: "10 min", value: "10 min" },
                  { emoji: "🕐", label: "30 min", value: "30 min" },
                  { emoji: "🕑", label: "1 time", value: "1 time" },
                  { emoji: "🌙", label: "Hele kvelden", value: "Hele kvelden" },
                ].map((opt, i) => (
                  <WizardChip
                    key={opt.value}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={wizard.time === opt.value}
                    onClick={() => setWizardTime(opt.value)}
                    animationDelay={`${i * 0.4}s`}
                  />
                ))}
              </div>
              <button
                onClick={() => setWizardStep(0)}
                className="w-full mt-2 py-3 rounded-2xl font-bold text-[15px] text-[#55556a] transition-all active:scale-[0.97]"
                style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
              >
                ← Tilbake
              </button>
            </div>
          )}

          {/* Step 2: Players */}
          {currentStep === 2 && (
            <div style={{ animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
              <div
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 0.5, lineHeight: 1.1 }}
                className="text-white"
              >
                Hvor mange er dere? 👥
              </div>
              <p className="text-sm text-[#55556a] font-semibold mt-0.5 mb-3">Velg ett alternativ</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { emoji: "🙋", label: "Bare meg", value: 1 },
                  { emoji: "👯", label: "2 personer", value: 2 },
                  { emoji: "👨‍👩‍👦", label: "3 personer", value: 3 },
                  { emoji: "🎉", label: "4+ personer", value: "4+" },
                ].map((opt, i) => (
                  <WizardChip
                    key={String(opt.value)}
                    emoji={opt.emoji}
                    label={opt.label}
                    selected={wizard.players === opt.value}
                    onClick={() => {
                      setWizardPlayers(opt.value);
                      if (opt.value === 1) {
                        // Solo: go straight to challenge
                        // Zustand set() is synchronous so getState() sees players immediately
                        startChallenge();
                      } else {
                        // Group: show friend selector
                        setWizardStep(3);
                      }
                    }}
                    animationDelay={`${i * 0.4}s`}
                  />
                ))}
              </div>
              <button
                onClick={() => setWizardStep(1)}
                className="w-full mt-2 py-3 rounded-2xl font-bold text-[15px] text-[#55556a] transition-all active:scale-[0.97]"
                style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
              >
                ← Tilbake
              </button>
            </div>
          )}

          {/* Step 3: Friend selector (group only) */}
          {currentStep === 3 && (
            <FriendSelector
              userId={userId}
              selectedFriends={wizard.selectedFriends}
              onSelect={setSelectedFriends}
              onConfirm={startChallenge}
              onBack={() => setWizardStep(2)}
            />
          )}

          {/* Join pill */}
          {currentStep < 3 && (
            <button
              onClick={() => router.push("/friends")}
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 px-3.5 font-bold text-sm text-[rgba(235,235,245,0.8)] transition-all active:scale-[0.97] w-full"
              style={{
                background: "#111118",
                border: "1.5px solid rgba(255,255,255,0.063)",
              }}
            >
              👯 Fått en kode fra en venn? Trykk her!
            </button>
          )}
        </div>
      )}

      {/* ── LOADING ── */}
      {screen === "loading" && (
        <div className="mt-3.5">
          <LoadingDots text={loadMsg} />
          <button
            onClick={backToSetup}
            className="w-full mt-6 py-3 rounded-2xl font-bold text-[13px] text-[#55556a] active:scale-[0.97] transition-all"
            style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
          >
            ← Avbryt
          </button>
        </div>
      )}

      {/* ── REVEAL ── */}
      {screen === "reveal" && currentChallenge && (
        <div
          className="flex flex-col items-center px-0 mt-10 gap-0"
          style={{ animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#55556a] mb-2.5">
            Klar til å starte?
          </div>
          <div className="flex gap-2 justify-center flex-wrap mb-8">
            {[wizard.mood, wizard.time, String(wizard.players) + " person(er)"].filter(Boolean).map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-[#55556a] rounded-lg px-2.5 py-1 font-semibold"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="gradient-text-primary"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 88,
              letterSpacing: 6,
              lineHeight: 1,
              marginBottom: 6,
              filter: "drop-shadow(0 0 24px rgba(255,45,85,.5))",
            }}
          >
            NÅ
          </div>
          <div className="text-sm text-[#55556a] font-medium mb-8">Din utfordring venter</div>
          <button
            onClick={startRevealCountdown}
            className="w-full py-[18px] rounded-2xl text-white font-extrabold text-[17px] active:scale-[0.97] transition-all"
            style={{
              background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
              boxShadow: "0 8px 32px rgba(255,45,85,0.45)",
            }}
          >
            START UTFORDRING
          </button>
          <button
            onClick={backToSetup}
            className="w-full mt-2.5 py-3 rounded-2xl font-bold text-[15px] text-[#55556a] transition-all active:scale-[0.97]"
            style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
          >
            ← Tilbake
          </button>
        </div>
      )}

      {/* ── COUNTDOWN ── */}
      {screen === "countdown" && (
        <div
          className="flex flex-col items-center justify-center mt-20 gap-3"
          style={{ animation: "countPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 190,
              lineHeight: 1,
              animation: "countPop 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {countNum}
          </div>
          <div className="text-sm font-semibold tracking-[2px] uppercase text-[#55556a]">
            Gjør deg klar...
          </div>
        </div>
      )}

      {/* ── FLIP ── */}
      {screen === "flip" && currentChallenge && (
        <div
          className="flex flex-col items-center mt-5 gap-0"
          style={{ animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div className="w-full" style={{ perspective: "1000px" }}>
            <div
              style={{
                width: "100%",
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 0.7s cubic-bezier(0.4,0,0.2,1)",
                minHeight: 320,
                transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Back */}
              <div
                style={{
                  position: "absolute", width: "100%", top: 0, left: 0,
                  backfaceVisibility: "hidden",
                  borderRadius: 22,
                  background: "#111118",
                  border: "1px solid rgba(255,255,255,0.063)",
                  minHeight: 320,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 10,
                }}
              >
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 110, color: "rgba(255,255,255,0.05)", lineHeight: 1 }}>?</div>
                <div className="text-[11px] font-semibold tracking-[2px] uppercase text-[#55556a]">Avsløres nå...</div>
              </div>
              {/* Front */}
              <div
                style={{
                  position: "absolute", width: "100%", top: 0, left: 0,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderRadius: 22,
                  background: "#111118",
                  border: "1px solid rgba(255,45,85,.18)",
                  minHeight: 320,
                  display: "flex", flexDirection: "column", overflow: "hidden",
                }}
              >
                <div className="rainbow-stripe flex-shrink-0" />
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <div
                      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest uppercase rounded-full px-3 py-1 mb-3.5"
                      style={{
                        background: currentChallenge.difficulty === "wild" ? "rgba(255,45,85,.12)" : currentChallenge.difficulty === "medium" ? "rgba(255,214,10,.1)" : "rgba(0,199,255,.1)",
                        color: currentChallenge.difficulty === "wild" ? "#ff2d55" : currentChallenge.difficulty === "medium" ? "#ffd60a" : "#00f0ff",
                      }}
                    >
                      {currentChallenge.difficulty === "wild" ? "🔴 VILL" : currentChallenge.difficulty === "medium" ? "🟡 MEDIUM" : "🟢 LETT"}
                    </div>
                    <div className="text-xl font-bold leading-[1.45] text-white">{currentChallenge.text}</div>
                  </div>
                  <div className="flex items-center justify-between mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.063)" }}>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[rgba(235,235,245,0.8)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff2d55]" style={{ animation: "boing 1.5s infinite" }} />
                      {currentChallenge.timeMinutes} min
                    </div>
                    {currentChallenge.cam && (
                      <div className="text-[11px] font-semibold text-[#55556a] bg-white/5 rounded-lg px-2.5 py-1">
                        📸 Krever bevis
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-full mt-3.5 flex flex-col gap-2.5"
            style={{
              opacity: flipped ? 1 : 0,
              transform: flipped ? "translateY(0)" : "translateY(10px)",
              transition: "all 0.4s ease 0.5s",
            }}
          >
            <button
              onClick={goToChallenge}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-[15px] active:scale-[0.97] transition-all"
              style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b00)", boxShadow: "0 8px 32px rgba(255,45,85,0.45)" }}
            >
              Til utfordringen →
            </button>
            <button
              onClick={backToSetup}
              className="w-full py-3 rounded-2xl font-bold text-[13px] text-[#55556a] active:scale-[0.97] transition-all"
              style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              ← Tilbake
            </button>
          </div>
        </div>
      )}

      {/* ── CHALLENGE ── */}
      {screen === "challenge" && currentChallenge && (
        <div
          className="flex flex-col gap-3.5 mt-3.5"
          style={{ animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <ChallengeCard challenge={currentChallenge} />

          {/* Group participants */}
          {isGroup && wizard.selectedFriends.length > 0 && (
            <div
              className="rounded-2xl py-3.5 px-[18px]"
              style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#55556a] mb-2">
                👥 Deltakere
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold bg-white/5 rounded-lg px-2.5 py-1.5 text-white">
                  👑 {profile.name} (deg)
                </span>
                {wizard.selectedFriends.map((f) => (
                  <span key={f.id} className="text-xs font-bold bg-white/5 rounded-lg px-2.5 py-1.5 text-[rgba(235,235,245,0.8)]">
                    {f.emoji} {f.username}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Camera button */}
          {currentChallenge.cam && !showCamera && (
            <button
              onClick={() => setShowCamera(true)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 cursor-pointer transition-all active:scale-[0.97] w-full"
              style={{
                background: "linear-gradient(135deg, rgba(0,199,255,.12), rgba(0,199,255,.05))",
                border: "1.5px solid rgba(0,199,255,.25)",
              }}
            >
              <span className="text-[26px]">📸</span>
              <div className="text-left">
                <div className="text-sm font-extrabold text-[#00f0ff]">Ta bilde / video</div>
                <div className="text-xs text-[#55556a]">Del med NÅ-filter på Snap, Insta & TikTok</div>
              </div>
              <span className="text-xl text-[#00f0ff] ml-auto">›</span>
            </button>
          )}

          {/* Punishment preview for group */}
          {currentChallenge.punishment && (
            <div
              className="rounded-2xl py-4 px-[18px] text-center"
              style={{
                background: "rgba(255,45,85,.06)",
                border: "1.5px solid rgba(255,45,85,.18)",
              }}
            >
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#ff2d55] mb-2">
                😈 Straff for taperen
              </div>
              <div className="text-base font-bold leading-snug">{currentChallenge.punishment}</div>
            </div>
          )}

          {/* Timer bar */}
          {timerActive && !timerExpired && (
            <div
              className="rounded-2xl p-[18px]"
              style={{
                background: timerSeconds < 60 ? "rgba(255,45,85,.06)" : "#111118",
                border: `1.5px solid ${timerSeconds < 60 ? "rgba(255,45,85,.4)" : "rgba(255,255,255,0.063)"}`,
                animation: timerSeconds < 60 ? "timerPulse 1s ease-in-out infinite" : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#55556a]">⏱ Tid igjen</div>
                <div
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 2 }}
                  className={timerSeconds < 60 ? "text-[#ff2d55]" : timerSeconds < timerMax * 0.4 ? "text-[#ffd60a]" : "text-[#00e676]"}
                >
                  {Math.floor(timerSeconds / 60)}:{String(timerSeconds % 60).padStart(2, "0")}
                </div>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(timerSeconds / timerMax) * 100}%`,
                    background: timerSeconds < 60 ? "#ff2d55" : timerSeconds < timerMax * 0.4 ? "#ffd60a" : "#00e676",
                    transition: "width 0.9s linear",
                  }}
                />
              </div>
            </div>
          )}

          {/* ── SOLO COMPLETION FLOW ── */}
          {isSolo && (
            <div
              className="rounded-2xl p-[18px]"
              style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              <div className="text-[10px] font-extrabold tracking-widest uppercase text-[#55556a] mb-3">
                📋 Fullfør utfordringen
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{
                      background: currentChallenge.cam
                        ? (hasProof ? "#00e676" : "linear-gradient(135deg, #ff2d55, #ff6b00)")
                        : "#00e676",
                      color: "#fff",
                    }}
                  >
                    {currentChallenge.cam ? (hasProof ? "✓" : "1") : "✓"}
                  </div>
                  <span className="text-xs font-bold text-[#55556a]">
                    {currentChallenge.cam ? (hasProof ? "Bilde tatt" : "Ta bilde") : "Gjør utfordringen"}
                  </span>
                </div>
                <div className="text-[#55556a]">→</div>
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{
                      background: hasShared ? "#00e676" : ((!currentChallenge.cam || hasProof) ? "linear-gradient(135deg, #ff2d55, #ff6b00)" : "rgba(255,255,255,.08)"),
                      color: hasShared ? "#fff" : ((!currentChallenge.cam || hasProof) ? "#fff" : "#55556a"),
                    }}
                  >
                    {hasShared ? "✓" : "2"}
                  </div>
                  <span className="text-xs font-bold text-[#55556a]">
                    {hasShared ? "Delt!" : "Del på SoMe"}
                  </span>
                </div>
              </div>

              {/* Photo button (if needed) */}
              {currentChallenge.cam && !hasProof && (
                <button
                  onClick={() => setShowProofCamera(true)}
                  className="w-full py-3.5 rounded-2xl text-sm font-extrabold active:scale-[0.97] transition-all flex items-center justify-center gap-2 mb-2"
                  style={{
                    background: "linear-gradient(135deg, #00f0ff, #0099cc)",
                    color: "#fff",
                  }}
                >
                  📸 Ta bevisbilde
                </button>
              )}

              {currentChallenge.cam && hasProof && !hasShared && (
                <div className="text-xs text-[#00e676] font-bold mb-2 text-center">Bilde tatt! Nå del det 👇</div>
              )}

              {/* Share buttons (required for solo) */}
              {(!currentChallenge.cam || hasProof) && !hasShared && (
                <div className="flex flex-col gap-2 mb-2">
                  <button
                    onClick={() => handleShareToSocial("native")}
                    className="w-full py-4 rounded-2xl text-base font-extrabold active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
                      color: "#fff",
                      boxShadow: "0 8px 32px rgba(255,45,85,0.35)",
                    }}
                  >
                    📲 Del bevis (Snap / Insta / annet)
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShareToSocial("snap")}
                      className="flex-1 py-3 rounded-2xl text-sm font-extrabold active:scale-[0.93] transition-all flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg,#fffc00,#ffd000)", color: "#000" }}
                    >
                      👻 Snap
                    </button>
                    <button
                      onClick={() => handleShareToSocial("insta")}
                      className="flex-1 py-3 rounded-2xl text-sm font-extrabold active:scale-[0.93] transition-all flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", color: "#fff" }}
                    >
                      📸 Insta
                    </button>
                  </div>
                </div>
              )}

              {hasShared && (
                <div className="text-xs text-[#00e676] font-bold mb-2 text-center">Delt! Marker som fullført 👇</div>
              )}

              {/* Complete button */}
              <button
                onClick={handleComplete}
                disabled={!hasShared}
                className="w-full py-3.5 rounded-2xl text-sm font-extrabold active:scale-[0.97] transition-all flex items-center justify-center gap-2 disabled:opacity-35 disabled:pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, #00e676, #22a03a)",
                  color: "#fff",
                }}
              >
                ✓ Fullført! (+10 pts)
              </button>
            </div>
          )}

          {/* ── GROUP COMPLETION FLOW ── */}
          {isGroup && (
            <div
              className="rounded-2xl p-[18px]"
              style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              {currentChallenge.cam && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setShowProofCamera(true)}
                    className="flex-1 py-3.5 rounded-2xl text-sm font-extrabold active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                    style={{
                      background: hasProof ? "rgba(0,230,118,.1)" : "linear-gradient(135deg, #00f0ff, #0099cc)",
                      color: hasProof ? "#00e676" : "#fff",
                      border: hasProof ? "1.5px solid rgba(0,230,118,.3)" : "none",
                    }}
                  >
                    {hasProof ? "✓ Bilde tatt" : "📸 Ta gruppebilde"}
                  </button>
                </div>
              )}

              <button
                onClick={handleComplete}
                className="w-full py-4 rounded-2xl text-white font-extrabold text-base active:scale-[0.97] transition-all"
                style={{
                  background: "linear-gradient(135deg, #00e676, #22a03a)",
                  boxShadow: "0 8px 24px rgba(0,230,118,0.3)",
                }}
              >
                ✓ Vi er ferdige! (+10 pts til alle)
              </button>
            </div>
          )}

          {/* Skip + back */}
          <button
            onClick={skipChallenge}
            className="flex items-center justify-center gap-2 w-full text-[#55556a] text-sm py-2"
          >
            ⏭ Hopp over{" "}
            <span
              className="text-[12px] font-extrabold text-[#ff2d55] rounded-lg px-2 py-0.5"
              style={{ background: "rgba(255,45,85,.1)" }}
            >
              −5 pts
            </span>
          </button>

          <button
            onClick={backToSetup}
            className="w-full py-3 rounded-2xl font-bold text-[13px] text-[#55556a] active:scale-[0.97] transition-all"
            style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
          >
            ← Endre valg
          </button>
        </div>
      )}

      {/* ── PUNISHMENT (group only) ── */}
      {screen === "punishment" && currentChallenge?.punishment && (
        <PunishmentScreen
          punishment={currentChallenge.punishment}
          participants={wizard.selectedFriends}
          hostName={profile.name}
          onConfirm={handlePunishmentConfirm}
          onSkip={handlePunishmentSkip}
        />
      )}

      {/* ── DONE / RESULT ── */}
      {screen === "done" && currentChallenge && (
        <div className="flex flex-col gap-3.5 mt-3.5">
          <ShareSheet
            challengeText={currentChallenge.text}
            username={profile.name}
            photoUrl={proofPhotoUrl}
            pts={profile.pts}
            onNext={nextChallenge}
          />
        </div>
      )}

      {/* Camera overlay */}
      {showCamera && currentChallenge && (
        <CameraCapture
          challengeText={currentChallenge.text}
          username={profile.name}
          onCapture={(url) => {
            setShowCamera(false);
            toast.success("Bilde tatt! 📸");
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showProofCamera && currentChallenge && (
        <CameraCapture
          challengeText={currentChallenge.text}
          username={profile.name}
          onCapture={handleProofCaptured}
          onClose={() => setShowProofCamera(false)}
        />
      )}

      {/* Timer expired overlay */}
      {timerExpired && (
        <div
          className="fixed inset-0 flex items-center justify-center p-8 z-[750]"
          style={{ background: "rgba(0,0,0,.9)", backdropFilter: "blur(16px)" }}
        >
          <div
            className="rounded-[28px] p-9 text-center w-full max-w-xs"
            style={{ background: "#111118", border: "1.5px solid rgba(255,45,85,.3)" }}
          >
            <span className="text-[64px] block mb-3">⏰</span>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: 1 }} className="text-[#ff2d55] mb-2">
              TIDEN ER UTE!
            </div>
            <div className="text-sm text-[#55556a] leading-relaxed mb-6">
              Du rakk ikke å fullføre i tide.<br />Ingen poeng denne gangen 😬
            </div>
            <button
              onClick={() => { setTimerExpired(false); nextChallenge(); }}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-base active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b00)" }}
            >
              Prøv en ny! 🎯
            </button>
            <button
              onClick={() => { setTimerExpired(false); backToSetup(); }}
              className="w-full mt-2 py-3 rounded-2xl font-bold text-sm text-[#55556a] border border-white/10"
            >
              Tilbake til start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
