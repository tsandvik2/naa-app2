export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          age_group: string;
          friend_code: string;
          pts: number;
          streak: number;
          best_streak: number;
          done_count: number;
          daily_done: boolean;
          daily_date: string | null;
          last_seen: string;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          age_group?: string;
          friend_code: string;
          pts?: number;
          streak?: number;
          best_streak?: number;
          done_count?: number;
          daily_done?: boolean;
          daily_date?: string | null;
          last_seen?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          age_group?: string;
          friend_code?: string;
          pts?: number;
          streak?: number;
          best_streak?: number;
          done_count?: number;
          daily_done?: boolean;
          daily_date?: string | null;
          last_seen?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      challenges: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          difficulty: "easy" | "medium" | "wild" | "safe";
          requires_camera: boolean;
          punishment: string | null;
          is_group: boolean;
          min_players: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          difficulty: "easy" | "medium" | "wild" | "safe";
          requires_camera?: boolean;
          punishment?: string | null;
          is_group?: boolean;
          min_players?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          difficulty?: "easy" | "medium" | "wild" | "safe";
          requires_camera?: boolean;
          punishment?: string | null;
          is_group?: boolean;
          min_players?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      completions: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string | null;
          challenge_text: string;
          photo_url: string | null;
          pts_earned: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id?: string | null;
          challenge_text: string;
          photo_url?: string | null;
          pts_earned?: number;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          challenge_id?: string | null;
          challenge_text?: string;
          photo_url?: string | null;
          pts_earned?: number;
          completed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "completions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      friendships: {
        Row: {
          id: string;
          from_user_id: string;
          to_user_id: string;
          status: "pending" | "accepted";
          created_at: string;
        };
        Insert: {
          id?: string;
          from_user_id: string;
          to_user_id: string;
          status?: "pending" | "accepted";
          created_at?: string;
        };
        Update: {
          id?: string;
          from_user_id?: string;
          to_user_id?: string;
          status?: "pending" | "accepted";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "friendships_from_user_id_fkey";
            columns: ["from_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "friendships_to_user_id_fkey";
            columns: ["to_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      difficulty_level: "easy" | "medium" | "wild" | "safe";
      friendship_status: "pending" | "accepted";
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
export type Completion = Database["public"]["Tables"]["completions"]["Row"];
export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];
