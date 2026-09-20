import "server-only";
import { redirect } from "next/navigation";
import { serverSupabase } from "./server";

export function adminEmail() {
  return (process.env.SUPABASE_ADMIN_EMAIL || "ed@eduardteodor.co.uk").trim().toLowerCase();
}

export async function getAdmin() {
  const supabase = await serverSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { supabase, user: !error && user?.email?.toLowerCase() === adminEmail() ? user : null };
}

export async function requireAdmin() {
  const result = await getAdmin();
  if (!result.user) redirect("/manage");
  return result;
}
