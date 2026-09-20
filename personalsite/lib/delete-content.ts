import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContentKind, Database, FormState } from "./content-types";

export async function removeContent(supabase: SupabaseClient<Database>, kind: ContentKind, id: string): Promise<FormState> {
  const { data: entry, error: readError } = await supabase.from(kind).select("id,md_path").eq("id", id).maybeSingle();
  if (readError) return { error: "Could not load the entry. Nothing was deleted. Try again." };
  if (!entry) return { message: "Entry already deleted." };

  // Hide the entry before removing its file. Clear the upload marker so an
  // interrupted deletion can be reopened and retried without a missing-body error.
  const { error: draftError } = await supabase.from(kind).update({
    published: false, md_uploaded_at: null, updated_at: new Date().toISOString(),
  }).eq("id", id).select("id").single();
  if (draftError) return { error: "Could not unpublish the entry. Nothing was deleted. Try again." };

  if (entry.md_path) {
    // Storage API deletion removes the actual file, not just its SQL metadata.
    const { error } = await supabase.storage.from("content").remove([entry.md_path]);
    if (error) return { error: "The entry is now a draft, but its file could not be deleted. Retry deletion to finish." };
  }

  const { error: deleteError } = await supabase.from(kind).delete().eq("id", id).select("id");
  if (deleteError) return { error: "The file was deleted, but the draft entry remains. Ensure migration 0004_storage_delete.sql has been applied, then retry deletion." };
  return { message: "Entry deleted." };
}
