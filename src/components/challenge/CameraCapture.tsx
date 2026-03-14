"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

interface CameraCaptureProps {
  challengeText: string;
  username: string;
  onCapture: (photoDataUrl: string) => void;
  onClose: () => void;
}

export function CameraCapture({
  challengeText,
  username,
  onCapture,
  onClose,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [camMode, setCamMode] = useState<"photo" | "video">("photo");
  const [isRecording, setIsRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCamera = useCallback(
    async (mode: "user" | "environment") => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
          audio: camMode === "video",
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch {
        toast.error("Kan ikke åpne kamera");
        onClose();
      }
    },
    [stream, camMode, onClose]
  );

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (recIntervalRef.current) clearInterval(recIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function flipCamera() {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  }

  function takePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedPhoto(dataUrl);
    stream?.getTracks().forEach((t) => t.stop());
  }

  function startVideoRecording() {
    if (!stream) return;
    chunksRef.current = [];
    const mr = new MediaRecorder(stream);
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setCapturedPhoto(url);
      stream.getTracks().forEach((t) => t.stop());
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setIsRecording(true);
    setRecSeconds(0);
    recIntervalRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
  }

  function stopVideoRecording() {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (recIntervalRef.current) clearInterval(recIntervalRef.current);
  }

  function handleShutter() {
    if (camMode === "photo") {
      takePhoto();
    } else if (!isRecording) {
      startVideoRecording();
    } else {
      stopVideoRecording();
    }
  }

  function retake() {
    setCapturedPhoto(null);
    startCamera(facingMode);
  }

  function confirmPhoto() {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
    }
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (capturedPhoto) {
    return (
      <div className="fixed inset-0 z-[810] bg-black flex flex-col">
        <img
          src={capturedPhoto}
          alt="Preview"
          className="w-full flex-1 object-cover"
        />
        {/* Filter overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between" style={{ paddingTop: "env(safe-area-inset-top, 20px)" }}>
          <div
            className="flex items-center justify-between px-5 py-4 pb-8"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,.7), transparent)" }}
          >
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 3, textShadow: "0 0 16px rgba(255,45,85,.9)" }}>
              NÅ
            </div>
            <div className="text-[9px] font-extrabold tracking-widest uppercase bg-[#ff2d55] rounded-full px-2.5 py-1">
              Jeg ble utfordret!
            </div>
          </div>
          <div
            className="px-3.5 pb-4"
            style={{ background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)" }}
          >
            <div className="text-sm font-bold text-white mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}>
              @{username}
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.85)] font-semibold leading-relaxed mb-1">
              {challengeText}
            </div>
            <div className="text-[11px] font-bold text-[rgba(100,180,255,0.9)]">
              #NåAppen #NåUtfordringen #JegBleUtfordret
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col gap-2.5 px-5 pt-10"
          style={{
            background: "linear-gradient(0deg, rgba(0,0,0,.95), transparent)",
            paddingBottom: "max(32px, env(safe-area-inset-bottom))",
          }}
        >
          <button
            onClick={confirmPhoto}
            className="w-full py-[17px] rounded-2xl font-extrabold text-base active:scale-[0.97] transition-all"
            style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b00)", color: "#fff" }}
          >
            ✓ Bruk dette bildet
          </button>
          <button
            onClick={retake}
            className="w-full py-3 rounded-2xl font-bold text-[13px] text-[#55556a] border border-white/10 active:scale-[0.97]"
          >
            ↩ Ta nytt bilde
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-bold text-[13px] text-[#55556a] active:scale-[0.97]"
          >
            ✕ Avbryt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[800] bg-black flex flex-col">
      <video
        ref={videoRef}
        className="w-full flex-1 object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Back button – top left, always visible */}
      <button
        onClick={onClose}
        className="absolute top-0 left-0 z-20 flex items-center gap-1.5 text-white font-bold text-sm px-4 py-3 active:opacity-60"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 16px) + 12px)", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}
      >
        ← Avbryt
      </button>

      {/* Filter overlay */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col justify-between"
        style={{ paddingTop: "env(safe-area-inset-top, 20px)" }}
      >
        {/* Corners */}
        {[
          { cls: "top-1.5 left-1.5 border-t-[2.5px] border-l-[2.5px] rounded-tl-[4px]" },
          { cls: "top-1.5 right-1.5 border-t-[2.5px] border-r-[2.5px] rounded-tr-[4px]" },
          { cls: "bottom-1.5 left-1.5 border-b-[2.5px] border-l-[2.5px] rounded-bl-[4px]" },
          { cls: "bottom-1.5 right-1.5 border-b-[2.5px] border-r-[2.5px] rounded-br-[4px]" },
        ].map((c, i) => (
          <div
            key={i}
            className={`absolute w-[18px] h-[18px] ${c.cls}`}
            style={{ borderColor: "#ff2d55" }}
          />
        ))}

        <div
          className="flex items-center justify-between px-5 py-4 pb-8"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,.7), transparent)" }}
        >
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, letterSpacing: 3, textShadow: "0 0 16px rgba(255,45,85,.9)" }}>
            NÅ
          </div>
          <div className="text-[9px] font-extrabold tracking-widest uppercase bg-[#ff2d55] rounded-full px-2.5 py-1">
            🔥 Utfordring
          </div>
        </div>

        {/* Side buttons (TikTok style) */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          {[
            { icon: "❤️", label: "Del" },
            { icon: "💬", label: "Svar" },
            { icon: "↗️", label: "Send" },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-0.5">
              <span className="text-[26px]" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.8))" }}>
                {b.icon}
              </span>
              <span className="text-[9px] font-extrabold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,.9)" }}>
                {b.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="px-3.5 pb-4 pr-14"
          style={{ background: "linear-gradient(0deg, rgba(0,0,0,.85), transparent)", paddingBottom: "40px" }}
        >
          <div className="text-sm font-extrabold text-white mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,.8)" }}>
            @{username}
          </div>
          <div className="text-xs text-[rgba(255,255,255,0.85)] font-semibold leading-relaxed mb-1">
            {challengeText}
          </div>
          <div className="text-[11px] font-bold text-[rgba(100,180,255,0.9)]">
            #NåUtfordringen #NåEllerAldri #JegBleUtfordret
          </div>
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-4 py-1.5 z-10 text-white font-extrabold text-sm"
          style={{ background: "rgba(255,45,85,.9)" }}
        >
          <div className="w-2 h-2 bg-white rounded-full" style={{ animation: "recBlink 1s ease-in-out infinite" }} />
          REC {formatTime(recSeconds)}
        </div>
      )}

      {/* Mode bar */}
      <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 flex gap-2 rounded-full p-1.5 z-10" style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)" }}>
        {(["photo", "video"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCamMode(m)}
            className="px-5 py-2 rounded-full border-none text-sm font-bold transition-all"
            style={{
              background: camMode === m ? "#fff" : "transparent",
              color: camMode === m ? "#000" : "rgba(255,255,255,0.6)",
            }}
          >
            {m === "photo" ? "📸 Bilde" : "🎥 Video"}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-6"
        style={{
          paddingBottom: "max(32px, env(safe-area-inset-bottom))",
          background: "linear-gradient(0deg, rgba(0,0,0,.9), transparent)",
          paddingTop: "20px",
        }}
      >
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-xl border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,.15)" }}
        >
          ✕
        </button>
        <button
          onClick={handleShutter}
          className="w-[72px] h-[72px] rounded-full flex-shrink-0 transition-all active:scale-[0.88]"
          style={{
            background: isRecording ? "#ff2d55" : "#fff",
            border: "4px solid rgba(255,255,255,.4)",
            borderRadius: isRecording ? "8px" : "50%",
          }}
        />
        <button
          onClick={flipCamera}
          className="w-11 h-11 rounded-full flex items-center justify-center text-xl border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,.15)", color: "#fff" }}
        >
          🔄
        </button>
      </div>
    </div>
  );
}
