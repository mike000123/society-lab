export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      post_votes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
          value: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "post_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["post_kind"];
          metadata: Json;
          thread_id: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["post_kind"];
          metadata?: Json;
          thread_id: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["post_kind"];
          metadata?: Json;
          thread_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "threads";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          full_name: string | null;
          id: string;
          reputation_score: number;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          id: string;
          reputation_score?: number;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string | null;
          id?: string;
          reputation_score?: number;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      proposal_votes: {
        Row: {
          created_at: string;
          id: string;
          proposal_id: string;
          user_id: string;
          value: number;
        };
        Insert: {
          created_at?: string;
          id?: string;
          proposal_id: string;
          user_id: string;
          value: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          proposal_id?: string;
          user_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_votes_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "proposal_votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      proposals: {
        Row: {
          author_id: string;
          body: string;
          created_at: string;
          id: string;
          status: Database["public"]["Enums"]["proposal_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          body: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["proposal_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          body?: string;
          created_at?: string;
          id?: string;
          status?: Database["public"]["Enums"]["proposal_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      simulations: {
        Row: {
          created_at: string;
          id: string;
          is_public: boolean;
          owner_id: string;
          results: Json;
          scenario: Json;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_public?: boolean;
          owner_id: string;
          results?: Json;
          scenario?: Json;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_public?: boolean;
          owner_id?: string;
          results?: Json;
          scenario?: Json;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "simulations_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      threads: {
        Row: {
          author_id: string;
          created_at: string;
          id: string;
          prompt: string | null;
          status: Database["public"]["Enums"]["thread_status"];
          title: string;
          topic_id: string | null;
          updated_at: string;
          visibility: Database["public"]["Enums"]["thread_visibility"];
        };
        Insert: {
          author_id: string;
          created_at?: string;
          id?: string;
          prompt?: string | null;
          status?: Database["public"]["Enums"]["thread_status"];
          title: string;
          topic_id?: string | null;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["thread_visibility"];
        };
        Update: {
          author_id?: string;
          created_at?: string;
          id?: string;
          prompt?: string | null;
          status?: Database["public"]["Enums"]["thread_status"];
          title?: string;
          topic_id?: string | null;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["thread_visibility"];
        };
        Relationships: [
          {
            foreignKeyName: "threads_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "threads_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          },
        ];
      };
      topics: {
        Row: {
          body_markdown: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          is_published: boolean;
          slug: string;
          summary: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body_markdown?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_published?: boolean;
          slug: string;
          summary: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          body_markdown?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          is_published?: boolean;
          slug?: string;
          summary?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "topics_created_by_fkey";
            columns: ["created_by"];
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
      post_kind: "claim" | "evidence" | "counterpoint" | "question" | "synthesis";
      proposal_status: "draft" | "open" | "accepted" | "rejected";
      thread_status: "draft" | "open" | "closed" | "archived";
      thread_visibility: "public" | "members" | "private";
    };
    CompositeTypes: Record<string, never>;
  };
};

