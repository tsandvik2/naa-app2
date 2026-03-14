"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/store/app-store";
import { LoadingDots } from "@/components/shared/LoadingDots";

interface FriendProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  pts: number;
  streak: number;
  friend_code: string;
}

export default function FriendsPage() {
  const profile = useAppStore((s) => s.profile);
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [pending, setPending] = useState<FriendProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [addCode, setAddCode] = useState("");
  const [addHint, setAddHint] = useState<{ msg: string; ok: boolean } | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    // Load accepted friends
    const { data: friendships } = await supabase
      .from("friendships")
      .select("to_user_id")
      .eq("from_user_id", user.id)
      .eq("status", "accepted");

    if (friendships && friendships.length > 0) {
      const ids = friendships.map((f) => f.to_user_id);
      const { data: friendProfiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, pts, streak, friend_code")
        .in("id", ids);
      setFriends(friendProfiles ?? []);
    }

    // Load pending requests TO this user
    const { data: pendingReqs } = await supabase
      .from("friendships")
      .select("from_user_id")
      .eq("to_user_id", user.id)
      .eq("status", "pending");

    if (pendingReqs && pendingReqs.length > 0) {
      const ids = pendingReqs.map((r) => r.from_user_id);
      const { data: pendingProfiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, pts, streak, friend_code")
        .in("id", ids);
      setPending(pendingProfiles ?? []);
    }

    setLoading(false);
  }

  async function addFriend() {
    if (!addCode.trim() || !userId) return;
    setAddLoading(true);
    setAddHint(null);

    const supabase = createClient();

    // Look up by friend code
    const { data: targetProfile } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("friend_code", addCode.trim().toUpperCase())
      .single();

    if (!targetProfile) {
      setAddHint({ msg: "Fant ingen med den koden 😕", ok: false });
      setAddLoading(false);
      return;
    }

    if (targetProfile.id === userId) {
      setAddHint({ msg: "Det er deg selv! 😅", ok: false });
      setAddLoading(false);
      return;
    }

    // Check already friends
    const existing = friends.find((f) => f.id === targetProfile.id);
    if (existing) {
      setAddHint({ msg: "Allerede venner!", ok: false });
      setAddLoading(false);
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      from_user_id: userId,
      to_user_id: targetProfile.id,
      status: "pending",
    });

    if (error) {
      setAddHint({ msg: "Forespørsel allerede sendt!", ok: false });
    } else {
      setAddHint({ msg: `Forespørsel sendt til ${targetProfile.username}! ✅`, ok: true });
      setAddCode("");
    }
    setAddLoading(false);
  }

  async function acceptFriend(fromUserId: string) {
    if (!userId) return;
    const supabase = createClient();

    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("from_user_id", fromUserId)
      .eq("to_user_id", userId);

    // Create reverse
    await supabase.from("friendships").upsert({
      from_user_id: userId,
      to_user_id: fromUserId,
      status: "accepted",
    });

    toast.success("Venn lagt til! 🎉");
    loadData();
  }

  async function removeFriend(friendId: string) {
    if (!userId) return;
    const supabase = createClient();
    await supabase
      .from("friendships")
      .delete()
      .eq("from_user_id", userId)
      .eq("to_user_id", friendId);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    toast.info("Venn fjernet");
  }

  async function copyMyCode() {
    const code = profile.friendCode || "NÅ-???";
    await navigator.clipboard?.writeText(code);
    toast.success("Kode kopiert! 📋");
  }

  async function shareOnSnap() {
    const text = `Legg meg til som venn på NÅ-appen! Kode: ${profile.friendCode}`;
    await navigator.clipboard?.writeText(text).catch(() => {});
    window.location.href = "snapchat://";
    setTimeout(() => {
      if (!document.hidden) toast.info("Åpner Snapchat — lim inn teksten!");
    }, 800);
  }

  return (
    <div style={{ animation: "slideUp 0.32s cubic-bezier(0.16,1,0.3,1)" }}>
      <div className="pt-12 pb-2">
        <div
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: 2 }}
          className="text-white"
        >
          VENNER
        </div>
      </div>

      {/* My code card */}
      <div
        className="rounded-[20px] p-[18px] mb-3.5"
        style={{
          background: "linear-gradient(135deg, rgba(255,45,85,.08), rgba(255,107,0,.05))",
          border: "1.5px solid rgba(255,45,85,.25)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-extrabold text-[#ff2d55] uppercase tracking-widest mb-0.5">
              👤 Din vennekode
            </div>
            <div className="text-xs text-[#55556a]">Del denne så venner kan legge deg til</div>
          </div>
          <div
            className="gradient-text-code flex-shrink-0 cursor-pointer select-all"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: 5 }}
            onClick={copyMyCode}
          >
            {profile.friendCode || "NÅ-???"}
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={shareOnSnap}
            className="flex-1 py-3 rounded-2xl text-sm font-extrabold active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            style={{ background: "#fffc00", color: "#000" }}
          >
            👻 Send på Snap
          </button>
          <button
            onClick={copyMyCode}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#55556a] active:scale-[0.97] transition-all"
            style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
          >
            📋 Kopier
          </button>
        </div>
      </div>

      {/* Add friend */}
      <div
        className="rounded-[18px] px-[18px] py-4 mb-3.5"
        style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
      >
        <div className="text-sm font-extrabold mb-2.5">➕ Legg til venn</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={addCode}
            onChange={(e) => setAddCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && addFriend()}
            placeholder="NÅ-ABC..."
            maxLength={10}
            className="flex-1 py-3.5 px-4 rounded-xl text-white font-bold text-base outline-none tracking-wider min-w-0 placeholder:text-[#55556a] placeholder:tracking-normal placeholder:font-semibold placeholder:text-sm"
            style={{
              background: "#0a0a0f",
              border: "1.5px solid rgba(255,255,255,0.063)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#00f0ff")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.063)")}
          />
          <button
            onClick={addFriend}
            disabled={addLoading || !addCode.trim()}
            className="py-3.5 px-[18px] rounded-xl text-sm font-extrabold text-white transition-all active:scale-[0.95] flex-shrink-0 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #00f0ff, #0099cc)" }}
          >
            Legg til
          </button>
        </div>
        {addHint && (
          <div
            className="text-xs font-bold mt-2"
            style={{ color: addHint.ok ? "#00e676" : "#ff2d55" }}
          >
            {addHint.msg}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingDots text="Laster venner..." />
      ) : (
        <>
          {/* Pending requests */}
          {pending.length > 0 && (
            <div className="mb-3.5">
              <div className="text-xs font-extrabold text-[#55556a] uppercase tracking-widest mb-2 px-0.5">
                🔥 Venter på deg
              </div>
              <div className="flex flex-col gap-2">
                {pending.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-2xl py-3.5 px-4"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,214,10,.06), rgba(255,107,0,.04))",
                      border: "1.5px solid rgba(255,214,10,.2)",
                    }}
                  >
                    <div className="text-[26px] flex-shrink-0">{p.avatar_url ?? "🔥"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold mb-0.5">{p.username}</div>
                      <div className="text-xs text-[#55556a]">Vil bli venn</div>
                    </div>
                    <button
                      onClick={() => acceptFriend(p.id)}
                      className="py-2 px-3.5 rounded-[10px] text-xs font-extrabold text-black active:scale-[0.93] transition-all"
                      style={{ background: "#ffd60a" }}
                    >
                      Godta
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Friends list */}
          <div className="text-xs font-extrabold text-[#55556a] uppercase tracking-widest mb-2 px-0.5">
            👯 Venneliste
          </div>

          {friends.length === 0 ? (
            <div
              className="rounded-[18px] py-8 px-5 text-center"
              style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              <div className="text-[48px] mb-3">👻</div>
              <div className="text-base font-extrabold mb-1.5">Ingen venner ennå</div>
              <div className="text-sm text-[#55556a] leading-relaxed">
                Del koden din på Snapchat<br />og legg dem til her!
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {friends.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-2xl py-3.5 px-4"
                  style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: "#161622" }}
                  >
                    {f.avatar_url ?? "🔥"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-extrabold mb-0.5 truncate">{f.username}</div>
                    <div className="text-[11px] text-[#55556a] font-semibold">
                      {f.pts} pts · {f.streak} streak 🔥
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeFriend(f.id)}
                      className="w-[34px] h-[34px] flex items-center justify-center rounded-[10px] text-base transition-all active:scale-[0.93]"
                      style={{
                        background: "rgba(255,255,255,.05)",
                        border: "1.5px solid rgba(255,255,255,0.063)",
                        color: "#55556a",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,45,85,.12)";
                        e.currentTarget.style.borderColor = "#ff2d55";
                        e.currentTarget.style.color = "#ff2d55";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,.05)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.063)";
                        e.currentTarget.style.color = "#55556a";
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
