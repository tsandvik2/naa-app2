"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/home", icon: "🎯", label: "Utfordring" },
  { href: "/today", icon: "📅", label: "Dagens" },
  { href: "/leaderboard", icon: "🏆", label: "Toppen" },
  { href: "/friends", icon: "👯", label: "Venner" },
  { href: "/profile", icon: "🏅", label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[500] flex"
      style={{
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center gap-[3px] py-2 transition-colors"
            style={{ color: isActive ? "#ff2d55" : "#55556a" }}
          >
            <span
              className="text-[22px] block transition-transform duration-200"
              style={{ transform: isActive ? "scale(1.18)" : "scale(1)" }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.8px]">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
