"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LoadingDots } from "@/components/shared/LoadingDots";
import type { SelectedFriend } from "@/store/app-store";

interface FriendSelectorProps {
  userId: string;
  selectedFriends: SelectedFriend[];
  onSelect: (friends: SelectedFriend[]) => void;
  onConfirm: () => void;
  onBack: () => void;
}

interface FriendRow {
  id: string;
  username: string;
  avatar_url: string | null;
  pts: number;
}

export function FriendSelector({ userId, selectedFriends, onSelect, onConfirm, onBack }: FriendSelectorProps) {
  const router = useRouter();
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();
  }, []);

  async function loadFriends() {
    const supabase = createClient();
    const { data: friendships } = await supabase
      .from("friendships")
      .select("to_user_id")
      .eq("from_user_id", userId)
      .eq("status", "accepted");

    if (friendships && friendships.length > 0) {
      const ids = friendships.map((f) => f.to_user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, pts")
        .in("id", ids);
      setFriends(profiles ?? []);
    }
    setLoading(false);
  }

  function toggleFriend(friend: FriendRow) {
    const isSelected = selectedFriends.some((f) => f.id === friend.id);
    if (isSelected) {
      onSelect(selectedFriends.filter((f) => f.id !== friend.id));
    } else {
      onSelect([...selectedFriends, {
        id: friend.id,
        username: friend.username,
        emoji: friend.avatar_url ?? "🔥",
      }]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto px-4 pt-6 pb-10"
      style={{ background: "#080810", animation: "slideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}
    >
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingDots text="Laster venner..." />
        </div>
      ) : (
        <>
          <div
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, letterSpacing: 0.5, lineHeight: 1.1 }}
            className="text-white"
          >
            Hvem er med? 👥
          </div>
          <p className="text-sm text-[#55556a] font-semibold mt-0.5 mb-3">
            Velg venner som deltar i utfordringen
          </p>

          {friends.length === 0 ? (
            <div
              className="rounded-[18px] py-6 px-5 text-center"
              style={{ background: "#111118", border: "1.5px solid rgba(255,255,255,0.063)" }}
            >
              <div className="text-[40px] mb-2">👻</div>
              <div className="text-base font-extrabold mb-1">Ingen venner ennå</div>
              <div className="text-sm text-[#55556a] leading-relaxed mb-4">
                Legg til venner med vennekode – så dukker de opp her neste gang!
              </div>
              <button
                onClick={() => router.push("/friends")}
                className="w-full py-3 rounded-2xl font-bold text-sm text-white active:scale-[0.97] transition-all"
                style={{ background: "linear-gradient(135deg, #ff2d55, #ff6b00)" }}
              >
                ➕ Legg til venner nå
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {friends.map((friend) => {
                const isSelected = selectedFriends.some((f) => f.id === friend.id);
                return (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriend(friend)}
                    className="flex items-center gap-3 rounded-2xl py-3.5 px-4 transition-all active:scale-[0.97] w-full text-left"
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(255,45,85,.08), rgba(255,107,0,.05))"
                        : "#111118",
                      border: isSelected
                        ? "1.5px solid rgba(255,45,85,.4)"
                        : "1.5px solid rgba(255,255,255,0.063)",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: "#161622" }}
                    >
                      {friend.avatar_url ?? "🔥"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-extrabold mb-0.5 truncate">{friend.username}</div>
                      <div className="text-[11px] text-[#55556a] font-semibold">
                        {friend.pts} pts
                      </div>
                    </div>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: isSelected ? "linear-gradient(135deg, #ff2d55, #ff6b00)" : "rgba(255,255,255,.08)",
                      }}
                    >
                      {isSelected ? (
                        <span className="text-white text-sm font-bold">✓</span>
                      ) : (
                        <span className="text-[#55556a] text-sm">+</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {selectedFriends.length > 0 && (
            <div className="mt-3 text-xs text-[#55556a] font-semibold">
              {selectedFriends.length} venn{selectedFriends.length > 1 ? "er" : ""} valgt — alle får +10 pts ved fullføring
            </div>
          )}

          <button
            onClick={onConfirm}
            disabled={friends.length > 0 && selectedFriends.length === 0}
            className="w-full mt-3 py-[18px] rounded-2xl text-white font-extrabold text-[17px] active:scale-[0.97] transition-all disabled:opacity-35 disabled:pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #ff2d55, #ff6b00)",
              boxShadow: "0 8px 32px rgba(255,45,85,0.45)",
            }}
          >
            {selectedFriends.length > 0
              ? `Start med ${selectedFriends.length} venn${selectedFriends.length > 1 ? "er" : ""} 🔥`
              : "Start utfordring 🔥"}
          </button>

          <button
            onClick={onConfirm}
            className="w-full mt-2 py-3 rounded-2xl font-bold text-sm text-[#55556a] active:scale-[0.97] transition-all"
            style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
          >
            Fortsett uten venner i appen
          </button>

          <button
            onClick={onBack}
            className="w-full mt-2 py-3 rounded-2xl font-bold text-[15px] text-[#55556a] transition-all active:scale-[0.97]"
            style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.063)" }}
          >
            ← Tilbake
          </button>
        </>
      )}
    </div>
  );
}
