"use client";

interface WizardChipProps {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  animationDelay?: string;
}

export function WizardChip({ emoji, label, selected, onClick, animationDelay }: WizardChipProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl py-[18px] px-2.5 cursor-pointer font-bold text-sm text-center leading-snug relative overflow-hidden transition-all"
      style={{
        background: selected ? "rgba(255,45,85,.14)" : "#111118",
        border: `1.5px solid ${selected ? "#ff2d55" : "rgba(255,255,255,0.063)"}`,
        color: selected ? "#fff" : "rgba(235,235,245,0.8)",
        transform: selected ? "scale(1.04)" : "scale(1)",
        boxShadow: selected ? "0 0 18px rgba(255,45,85,.22)" : "none",
        fontFamily: "var(--font-jakarta), sans-serif",
        animation: !selected && animationDelay
          ? `chipBreathe 2.5s ease-in-out infinite ${animationDelay}`
          : selected
            ? "chipPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards"
            : undefined,
      }}
    >
      <em
        className="text-[26px] block mb-1.5 not-italic transition-transform duration-300"
        style={{ transform: selected ? "scale(1.15) rotate(-5deg)" : "scale(1)" }}
      >
        {emoji}
      </em>
      {label}
    </button>
  );
}
