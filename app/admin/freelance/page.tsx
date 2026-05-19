"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import { adminApi, FreelanceWork, formatDate } from "@/lib/api";

export default function AdminFreelancePage() {
  return <AdminGuard>{(token) => <FreelanceManager token={token} />}</AdminGuard>;
}

function FreelanceManager({ token }: { token: string }) {
  const [entries, setEntries] = useState<FreelanceWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    adminApi
      .freelance(token)
      .then(setEntries)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load entries."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function remove(id: string) {
    if (!window.confirm("Delete this freelance entry?")) return;
    setLoading(true);
    await adminApi.deleteFreelance(token, id);
    load();
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">Freelance entries</h2>
        <Link href="/admin/freelance/new" className="button">
          New entry
        </Link>
      </div>
      <AdminNotice loading={loading} error={error} />
      {!loading && !error ? (
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3">Project</th>
                <th className="p-3">Client</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">{entry.projectTitle}</p>
                    <p className="text-xs text-slate-500">{entry.featured ? "Featured" : "Standard"} / {entry.published ? "Published" : "Draft"}</p>
                  </td>
                  <td className="p-3">{entry.clientName || "Private client"}</td>
                  <td className="p-3">{formatDate(entry.completedAt)}</td>
                  <td className="flex flex-wrap gap-2 p-3">
                    <Link href={`/admin/freelance/${entry.id}/edit`} className="button px-3 py-1 text-xs">
                      Edit
                    </Link>
                    <button type="button" onClick={() => remove(entry.id)} className="px-3 py-1 text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
