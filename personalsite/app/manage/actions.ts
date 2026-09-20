"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminEmail, getAdmin } from "@/lib/supabase/admin";
import { serverSupabase } from "@/lib/supabase/server";
import { parseContentForm, UUID_PATTERN } from "@/lib/content-validation";
import { persistContent } from "@/lib/save-content";
import { removeContent } from "@/lib/delete-content";
import { isContentKind } from "@/lib/content-types";
import type { FormState } from "@/lib/content-types";

export async function signIn(_state: FormState, form: FormData): Promise<FormState> {
  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !password || email.trim().toLowerCase() !== adminEmail()) return { error: "Unable to sign in. Check your email and password." };
  try {
    const supabase = await serverSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error || data.user?.email?.toLowerCase() !== adminEmail()) {
      if (data.session) await supabase.auth.signOut();
      return { error: "Unable to sign in. Check your email and password." };
    }
  } catch { return { error: "Sign-in is temporarily unavailable. Try again." }; }
  redirect("/manage");
}

export async function signOut(): Promise<FormState> {
  const supabase = await serverSupabase();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) return { error: "Could not sign out. Try again." };
  redirect("/manage");
}

export async function saveContent(_state: FormState, form: FormData): Promise<FormState> {
  const { supabase, user } = await getAdmin();
  if (!user) return { error: "Your session has expired. Sign in again in another tab, then retry this save." };
  let input;
  try { input = parseContentForm(form); }
  catch (error) { return { error: error instanceof Error ? error.message : "Check the entry fields." }; }
  let result: FormState;
  try { result = await persistContent(supabase, input); }
  catch { result = { error: "The save was interrupted. The entry may now be a draft. Your text is still here; save again to finish." }; }
  // Partial saves can also have unpublished the row.
  revalidatePath("/");
  revalidatePath("/[kind]/[slug]", "page");
  if (result.error) return result;
  revalidatePath("/manage", "layout");
  redirect(`/manage/${input.kind}/${input.id}?saved=1`);
}

export async function deleteContent(_state: FormState, form: FormData): Promise<FormState> {
  const { supabase, user } = await getAdmin();
  if (!user) return { error: "Your session has expired. Sign in again before deleting." };
  const kind = form.get("kind");
  const id = form.get("id");
  if (typeof kind !== "string" || !isContentKind(kind) || typeof id !== "string" || !UUID_PATTERN.test(id) || form.get("confirmed") !== "yes") {
    return { error: "Invalid deletion request. Confirm the entry you want to delete." };
  }
  let result: FormState;
  try { result = await removeContent(supabase, kind, id); }
  catch { result = { error: "Deletion was interrupted and may be partially complete. Retry deletion to finish." }; }
  revalidatePath("/");
  revalidatePath("/[kind]/[slug]", "page");
  if (result.error) return result;
  revalidatePath("/manage", "layout");
  redirect("/manage");
}
