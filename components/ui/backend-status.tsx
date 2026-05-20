"use client";

import { useEffect, useState } from "react";

type BackendState = "checking" | "online" | "issues" | "offline";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://api.eduardteodor.co.uk"
    : "http://localhost:8080");

const statusStyles: Record<BackendState, string> = {
  checking: "border-slate-200 bg-slate-50 text-slate-500",
  online: "border-emerald-200 bg-emerald-50 text-emerald-700",
  issues: "border-amber-200 bg-amber-50 text-amber-700",
  offline: "border-rose-200 bg-rose-50 text-rose-700",
};

const dotStyles: Record<BackendState, string> = {
  checking: "bg-slate-400",
  online: "bg-emerald-500",
  issues: "bg-amber-500",
  offline: "bg-rose-500",
};

const labels: Record<BackendState, string> = {
  checking: "Checking backend server status",
  online: "Backend server online",
  issues: "Backend server has issues",
  offline: "Backend server offline",
};

export default function BackendStatus() {
  const [status, setStatus] = useState<BackendState>("checking");

  useEffect(() => {
    let isMounted = true;

    async function checkBackend() {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${API_BASE}/health`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!isMounted) return;
        setStatus(response.ok ? "online" : "issues");
      } catch {
        if (isMounted) {
          setStatus("offline");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    checkBackend();
    const interval = window.setInterval(checkBackend, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`inline-flex h-9 items-center gap-2 rounded-md border px-2.5 text-xs font-bold transition-colors ${statusStyles[status]}`}
      role="status"
      aria-label={labels[status]}
      title={labels[status]}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${dotStyles[status]}`}
        aria-hidden="true"
      />
      <span>API</span>
    </div>
  );
}
