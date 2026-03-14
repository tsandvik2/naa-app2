"use client";

interface LoadingDotsProps {
  text?: string;
}

export function LoadingDots({ text = "Laster..." }: LoadingDotsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="flex gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full bg-[#ff2d55]"
          style={{ animation: "boing 1.1s infinite" }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-[#ffd60a]"
          style={{ animation: "boing 1.1s infinite 0.18s" }}
        />
        <div
          className="w-2.5 h-2.5 rounded-full bg-[#00f0ff]"
          style={{ animation: "boing 1.1s infinite 0.36s" }}
        />
      </div>
      <p className="text-[#55556a] text-sm font-semibold text-center">{text}</p>
    </div>
  );
}
