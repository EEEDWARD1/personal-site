"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import { adminApi, Project } from "@/lib/api";

export default function AdminProjectsPage() {
  return <AdminGuard>{(token) => <ProjectManager token={token} />}</AdminGuard>;
}

function ProjectManager({ token }: { token: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    adminApi
      .projects(token)
      .then(setProjects)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load projects."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function remove(id: string) {
    if (!window.confirm("Delete this project?")) return;
    setLoading(true);
    await adminApi.deleteProject(token, id);
    load();
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">Projects</h2>
        <Link href="/admin/projects/new" className="button">
          New project
        </Link>
      </div>
      <AdminNotice loading={loading} error={error} />
      {!loading && !error ? (
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.map((project) => (
                <tr key={project.id}>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">{project.title}</p>
                    <p className="text-xs text-slate-500">{project.summary}</p>
                  </td>
                  <td className="p-3">{project.status}</td>
                  <td className="p-3">{project.featured ? "Yes" : "No"}</td>
                  <td className="flex flex-wrap gap-2 p-3">
                    <Link href={`/admin/projects/${project.id}/edit`} className="button px-3 py-1 text-xs">
                      Edit
                    </Link>
                    <button type="button" onClick={() => remove(project.id)} className="px-3 py-1 text-xs">
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
