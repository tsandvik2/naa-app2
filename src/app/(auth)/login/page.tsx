"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6" style={{ animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1)" }}>
      {/* Logo */}
      <div className="text-center mb-2">
        <div
          className="gradient-text-logo"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 80,
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          NÅ
        </div>
        <p className="text-sm font-bold text-[rgba(235,235,245,0.8)] mt-1">
          Slutt å scrolle. Begynn å leve.
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "#111118",
          border: "1.5px solid rgba(255,255,255,0.063)",
        }}
      >
        <h1
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 1 }}
          className="mb-1 text-white"
        >
          Logg inn
        </h1>
        <p className="text-sm text-[#55556a] mb-6">Velkommen tilbake! 👋</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#55556a] uppercase tracking-wider">
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              required
              className="w-full px-4 py-4 rounded-2xl text-white font-bold text-base outline-none transition-all placeholder:text-[#55556a]"
              style={{
                background: "#111118",
                border: "1.5px solid rgba(255,255,255,0.063)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ff2d55")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.063)")
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#55556a] uppercase tracking-wider">
              Passord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-4 rounded-2xl text-white font-bold text-base outline-none transition-all placeholder:text-[#55556a]"
              style={{
                background: "#111118",
                border: "1.5px solid rgba(255,255,255,0.063)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ff2d55")}
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.063)")
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-base transition-all active:scale-[0.97] disabled:opacity-60 mt-2"
            style={{
              background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
              boxShadow:
                "0 8px 32px rgba(255,45,85,0.45), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {loading ? "Logger inn..." : "Logg inn →"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-[#55556a]">
        Har du ikke konto?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#ff2d55] hover:underline"
        >
          Registrer deg
        </Link>
      </p>
    </div>
  );
}
