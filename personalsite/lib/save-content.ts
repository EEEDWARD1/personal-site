import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, FormState } from "./content-types";
import type { parseContentForm } from "./content-validation";

// Independent of Next.js so partial Storage/Database failures can be tested.
export async function persistContent(supabase: SupabaseClient<Database>, input: ReturnType<typeof parseContentForm>): Promise<FormState> {
  const { kind, id, metadata, markdown, published } = input;
  const { data: previous, error: readError } = await supabase.from(kind).select("*").eq("id", id).maybeSingle();
  if (readError) return { error: "Could not load this entry. Try again." };
  // Never assign md_path: both DEFAULT and GENERATED schemas work.
  // Keep the row a draft until BOTH metadata and Markdown have been saved.
  const draft = { title: metadata.title, slug: metadata.slug, tags: metadata.tags, featured: metadata.featured, published: false, updated_at: new Date().toISOString() };
  const projectDraft = { ...draft, summary: metadata.summary!, repo_url: metadata.repo_url, live_url: metadata.live_url };
  const result = kind === "projects"
    ? previous
      ? await supabase.from("projects").update(projectDraft).eq("id", id).select("*").single()
      : await supabase.from("projects").insert({ ...projectDraft, id }).select("*").single()
    : previous
      ? await supabase.from("thoughts").update(draft).eq("id", id).select("*").single()
      : await supabase.from("thoughts").insert({ ...draft, id }).select("*").single();
  if (result.error) return { error: result.error.code === "23505" ? "That slug is already in use. Choose another." : "Could not save the entry. Check your table permissions and try again." };
  const row = result.data;
  if (!row.md_path) return { id, error: "The entry was saved as a draft, but its Markdown path is missing. Check the table's md_path default." };
  const { error: uploadError } = await supabase.storage.from("content").upload(row.md_path, new Blob([markdown], { type: "text/markdown" }), {
    contentType: "text/markdown", upsert: true, cacheControl: "0",
  });
  if (uploadError) return { id, error: "The entry is saved as a draft, but the Markdown upload failed. Your text is still in the editor. Check the content bucket permissions and save again." };
  const now = new Date().toISOString();
  const { error: finishError } = await supabase.from(kind).update({
    md_uploaded_at: now, published,
    published_at: previous?.published_at || (published ? now : null), updated_at: now,
  }).eq("id", id).select("id").single();
  if (finishError) return { id, error: "Markdown was uploaded, but the entry remains a draft because the final save failed. Save again to finish." };
  return { id, message: published ? "Published." : "Draft saved." };
}
