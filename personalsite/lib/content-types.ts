export const contentKinds = ["projects", "thoughts"] as const;
export type ContentKind = (typeof contentKinds)[number];

export function isContentKind(value: string): value is ContentKind {
  return contentKinds.some((kind) => kind === value);
}

export type ContentRow = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  md_path: string | null;
  md_uploaded_at: string | null;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  summary?: string;
  repo_url?: string | null;
  live_url?: string | null;
};

type ThoughtRow = Omit<ContentRow, "summary" | "repo_url" | "live_url">;
type ProjectRow = ThoughtRow & {
  summary: string;
  repo_url: string | null;
  live_url: string | null;
};
type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Pick<Row, Required> & Partial<Omit<Row, Required | "md_path">>;
  Update: Partial<Omit<Row, "md_path">>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      thoughts: Table<ThoughtRow, "title" | "slug">;
      projects: Table<ProjectRow, "title" | "slug" | "summary">;
    };
    Views: { [_ in never]: never };
    Functions: { is_admin: { Args: Record<string, never>; Returns: boolean } };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type FormState = { error?: string; message?: string; id?: string };
