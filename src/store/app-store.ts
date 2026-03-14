"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectedChallenge } from "@/lib/challenges/data";

export interface UserProfile {
  name: string;
  emoji: string;
  ageGroup: string;
  pts: number;
  streak: number;
  best: number;
  done: number;
  history: HistoryEntry[];
  earnedBadges: string[];
  dailyDone: boolean;
  dailyDate: string;
  friendCode: string;
}

export interface HistoryEntry {
  text: string;
  emoji: string;
  date: string;
  pts: number;
}

export interface WizardState {
  mood: string | null;
  time: string | null;
  players: number | string | null;
  step: number;
}

interface AppState {
  profile: UserProfile;
  wizard: WizardState;
  currentChallenge: SelectedChallenge | null;
  proofPhotoUrl: string | null;
  onboardingComplete: boolean;

  setProfile: (updates: Partial<UserProfile>) => void;
  setWizardMood: (mood: string) => void;
  setWizardTime: (time: string) => void;
  setWizardPlayers: (players: number | string) => void;
  setWizardStep: (step: number) => void;
  resetWizard: () => void;
  setCurrentChallenge: (challenge: SelectedChallenge | null) => void;
  setProofPhotoUrl: (url: string | null) => void;
  completeChallenge: (pts: number, challengeText: string, emoji: string) => void;
  completeOnboarding: () => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: "",
  emoji: "🔥",
  ageGroup: "16-19",
  pts: 0,
  streak: 0,
  best: 0,
  done: 0,
  history: [],
  earnedBadges: [],
  dailyDone: false,
  dailyDate: "",
  friendCode: "",
};

const defaultWizard: WizardState = {
  mood: null,
  time: null,
  players: null,
  step: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      wizard: defaultWizard,
      currentChallenge: null,
      proofPhotoUrl: null,
      onboardingComplete: false,

      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),

      setWizardMood: (mood) =>
        set((state) => ({
          wizard: { ...state.wizard, mood, step: 1 },
        })),

      setWizardTime: (time) =>
        set((state) => ({
          wizard: { ...state.wizard, time, step: 2 },
        })),

      setWizardPlayers: (players) =>
        set((state) => ({
          wizard: { ...state.wizard, players },
        })),

      setWizardStep: (step) =>
        set((state) => ({
          wizard: { ...state.wizard, step },
        })),

      resetWizard: () =>
        set({ wizard: defaultWizard, currentChallenge: null, proofPhotoUrl: null }),

      setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),

      setProofPhotoUrl: (url) => set({ proofPhotoUrl: url }),

      completeChallenge: (pts, challengeText, emoji) => {
        const state = get();
        const today = new Date().toDateString();
        const lastDate = state.profile.dailyDate;
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        const newStreak =
          lastDate === yesterday
            ? state.profile.streak + 1
            : lastDate === today
              ? state.profile.streak
              : 1;

        const newBest = Math.max(newStreak, state.profile.best);
        const newDone = state.profile.done + 1;
        const newPts = state.profile.pts + pts;

        const historyEntry: HistoryEntry = {
          text: challengeText,
          emoji,
          date: new Date().toLocaleDateString("no", {
            day: "numeric",
            month: "short",
          }),
          pts,
        };

        set((s) => ({
          profile: {
            ...s.profile,
            pts: newPts,
            streak: newStreak,
            best: newBest,
            done: newDone,
            dailyDate: today,
            history: [historyEntry, ...s.profile.history.slice(0, 19)],
          },
        }));
      },

      completeOnboarding: () => set({ onboardingComplete: true }),

      resetProfile: () =>
        set({
          profile: defaultProfile,
          wizard: defaultWizard,
          currentChallenge: null,
          proofPhotoUrl: null,
          onboardingComplete: false,
        }),
    }),
    {
      name: "na-app-v1",
      partialize: (state) => ({
        profile: state.profile,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
