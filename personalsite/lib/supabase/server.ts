import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/content-types";
import { authCookieOptions, supabaseConfig } from "./config";

// Public pages never inherit the administrator's cookies or draft access.
// Fetches are left uncached here so route segment config decides freshness:
// force-dynamic routes (detail pages) still get every request live, while
// the homepage's `revalidate` window can actually cache this data.
export function publicSupabase() {
  const { url, key } = supabaseConfig();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

export async function serverSupabase() {
  const cookieStore = await cookies();
  const { url, key } = supabaseConfig();
  return createServerClient<Database>(url, key, {
    cookieOptions: authCookieOptions,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot set cookies; proxy.ts refreshes them.
        }
      },
    },
  });
}
