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
          academic_level: string | null;
          allow_participant_invites: boolean;
          allow_study_circle_invites: boolean;
          avatar_url: string | null;
          bio: string | null;
          contact_permission: Database["public"]["Enums"]["contact_permission"];
          created_at: string;
          discoverable_by_shared_modules: boolean;
          expertise_domains: string[];
          full_name: string | null;
          id: string;
          linkedin_url: string | null;
          professional_stage: string | null;
          professional_title: string | null;
          reputation_score: number;
          share_linkedin_profile: boolean;
          show_learning_activity: boolean;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          academic_level?: string | null;
          allow_participant_invites?: boolean;
          allow_study_circle_invites?: boolean;
          avatar_url?: string | null;
          bio?: string | null;
          contact_permission?: Database["public"]["Enums"]["contact_permission"];
          created_at?: string;
          discoverable_by_shared_modules?: boolean;
          expertise_domains?: string[];
          full_name?: string | null;
          id: string;
          linkedin_url?: string | null;
          professional_stage?: string | null;
          professional_title?: string | null;
          reputation_score?: number;
          share_linkedin_profile?: boolean;
          show_learning_activity?: boolean;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          academic_level?: string | null;
          allow_participant_invites?: boolean;
          allow_study_circle_invites?: boolean;
          avatar_url?: string | null;
          bio?: string | null;
          contact_permission?: Database["public"]["Enums"]["contact_permission"];
          created_at?: string;
          discoverable_by_shared_modules?: boolean;
          expertise_domains?: string[];
          full_name?: string | null;
          id?: string;
          linkedin_url?: string | null;
          professional_stage?: string | null;
          professional_title?: string | null;
          reputation_score?: number;
          share_linkedin_profile?: boolean;
          show_learning_activity?: boolean;
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
      proposal_comments: {
        Row: {
          author_id: string;
          content: string;
          created_at: string;
          id: string;
          proposal_id: string;
          tag: Database["public"]["Enums"]["proposal_comment_tag"];
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          created_at?: string;
          id?: string;
          proposal_id: string;
          tag: Database["public"]["Enums"]["proposal_comment_tag"];
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          proposal_id?: string;
          tag?: Database["public"]["Enums"]["proposal_comment_tag"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposal_comments_author_id_fkey";
            columns: ["author_id"];
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
      thread_participants: {
        Row: {
          created_at: string;
          id: string;
          invited_by: string | null;
          role: Database["public"]["Enums"]["thread_participant_role"];
          status: Database["public"]["Enums"]["thread_participant_status"];
          thread_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invited_by?: string | null;
          role?: Database["public"]["Enums"]["thread_participant_role"];
          status?: Database["public"]["Enums"]["thread_participant_status"];
          thread_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invited_by?: string | null;
          role?: Database["public"]["Enums"]["thread_participant_role"];
          status?: Database["public"]["Enums"]["thread_participant_status"];
          thread_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "thread_participants_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thread_participants_thread_id_fkey";
            columns: ["thread_id"];
            isOneToOne: false;
            referencedRelation: "threads";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "thread_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      threads: {
        Row: {
          author_id: string;
          context_slug: string | null;
          context_type: Database["public"]["Enums"]["thread_context_type"];
          created_at: string;
          desired_academic_levels: string[];
          desired_expertise_domains: string[];
          desired_professional_stages: string[];
          id: string;
          kind: Database["public"]["Enums"]["thread_kind"];
          participation_mode: Database["public"]["Enums"]["thread_participation_mode"];
          prompt: string | null;
          status: Database["public"]["Enums"]["thread_status"];
          title: string;
          topic_id: string | null;
          updated_at: string;
          visibility: Database["public"]["Enums"]["thread_visibility"];
        };
        Insert: {
          author_id: string;
          context_slug?: string | null;
          context_type?: Database["public"]["Enums"]["thread_context_type"];
          created_at?: string;
          desired_academic_levels?: string[];
          desired_expertise_domains?: string[];
          desired_professional_stages?: string[];
          id?: string;
          kind?: Database["public"]["Enums"]["thread_kind"];
          participation_mode?: Database["public"]["Enums"]["thread_participation_mode"];
          prompt?: string | null;
          status?: Database["public"]["Enums"]["thread_status"];
          title: string;
          topic_id?: string | null;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["thread_visibility"];
        };
        Update: {
          author_id?: string;
          context_slug?: string | null;
          context_type?: Database["public"]["Enums"]["thread_context_type"];
          created_at?: string;
          desired_academic_levels?: string[];
          desired_expertise_domains?: string[];
          desired_professional_stages?: string[];
          id?: string;
          kind?: Database["public"]["Enums"]["thread_kind"];
          participation_mode?: Database["public"]["Enums"]["thread_participation_mode"];
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
      user_module_progress: {
        Row: {
          completed_at: string | null;
          created_at: string;
          id: string;
          module_slug: string;
          quiz_passed: boolean;
          quiz_score: number | null;
          updated_at: string;
          user_id: string;
          visited: boolean;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          module_slug: string;
          quiz_passed?: boolean;
          quiz_score?: number | null;
          updated_at?: string;
          user_id: string;
          visited?: boolean;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          module_slug?: string;
          quiz_passed?: boolean;
          quiz_score?: number | null;
          updated_at?: string;
          user_id?: string;
          visited?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "user_module_progress_user_id_fkey";
            columns: ["user_id"];
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
      contact_permission: "none" | "shared_modules" | "any_member";
      post_kind: "claim" | "evidence" | "counterpoint" | "question" | "synthesis";
      proposal_comment_tag:
        | "point_of_improvement"
        | "feasibility_issue"
        | "implementation_detail"
        | "supporting_evidence"
        | "risk_tradeoff"
        | "clarifying_question";
      proposal_status: "draft" | "open" | "accepted" | "rejected";
      thread_context_type: "general" | "module" | "track";
      thread_kind: "public_discussion" | "private_circle";
      thread_participant_role: "owner" | "member";
      thread_participant_status: "pending" | "accepted" | "declined" | "left";
      thread_participation_mode: "open" | "background_guided";
      thread_status: "draft" | "open" | "closed" | "archived";
      thread_visibility: "public" | "members" | "private";
    };
    CompositeTypes: Record<string, never>;
  };
};
