import "server-only";
import { cache } from "react";
import { publicSupabase } from "@/lib/supabase/server";
import type { ContentKind, ContentRow } from "@/lib/content-types";
import { SLUG_PATTERN } from "@/lib/content-validation";

export async function listPublished(kind: ContentKind) {
  const { data, error } = await publicSupabase().from(kind).select("*")
    .eq("published", true).order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error(`Could not load ${kind}.`);
  return data as ContentRow[];
}

export const getPublishedEntry = cache(async (kind: ContentKind, slug: string) => {
  if (!SLUG_PATTERN.test(slug)) return null;
  const { data, error } = await publicSupabase().from(kind).select("*")
    .eq("published", true).eq("slug", slug).maybeSingle();
  if (error) throw new Error("Could not load this entry.");
  return data as ContentRow | null;
});

export async function publishedMarkdown(entry: ContentRow) {
  if (!entry.published || !entry.md_path || !entry.md_uploaded_at) throw new Error("Published Markdown is unavailable.");
  const storage = publicSupabase().storage.from("content");
  // Private buckets use the published-row Storage policy in migration 0003.
  const { data, error } = await storage.download(entry.md_path);
  if (!error) return data.text();
  // Compatibility with the user's existing PUBLIC bucket (migrations 0001/0002).
  // This is only reached after an anonymous published-row lookup; never for drafts.
  const { data: { publicUrl } } = storage.getPublicUrl(entry.md_path);
  const url = new URL(publicUrl);
  url.searchParams.set("v", entry.md_uploaded_at);
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load this entry's Markdown.");
  return response.text();
}
