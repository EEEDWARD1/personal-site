"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuthToken, getAuthToken, hasValidAuthToken } from "@/lib/api";

export default function AdminGuard({
  children,
}: {
  children: (token: string) => React.ReactNode;
}) {
  const router = useRouter();
  const [token] = useState<string | null>(() =>
    hasValidAuthToken() ? getAuthToken() : null,
  );

  useEffect(() => {
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router, token]);

  if (!token) {
    return (
      <main className="rounded-md border border-slate-200 bg-white/85 p-5">
        <p>Checking admin session...</p>
      </main>
    );
  }

  return (
    <main className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white/85 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
            Admin
          </p>
          <h1 className="text-2xl">Content management</h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/admin/dashboard" className="text-slate-700 hover:text-teal-700">
            Dashboard
          </Link>
          <Link href="/admin/blog" className="text-slate-700 hover:text-teal-700">
            Blog
          </Link>
          <Link href="/admin/projects" className="text-slate-700 hover:text-teal-700">
            Projects
          </Link>
          <Link href="/admin/freelance" className="text-slate-700 hover:text-teal-700">
            Freelance
          </Link>
          <Link href="/admin/mfa-setup" className="text-slate-700 hover:text-teal-700">
            MFA Setup
          </Link>
          <button
            type="button"
            onClick={() => {
              clearAuthToken();
              router.replace("/admin/login");
            }}
            className="px-3 py-1 text-xs"
          >
            Sign out
          </button>
        </div>
      </div>
      {children(token)}
    </main>
  );
}
