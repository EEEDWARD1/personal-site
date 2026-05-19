"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, Project, ProjectInput } from "@/lib/api";
import { CheckboxField } from "./fields";

const emptyProject: ProjectInput = {
  title: "",
  description: "",
  summary: "",
  techStack: "",
  githubUrl: "",
  liveUrl: "",
  status: "in_progress",
  featured: false,
  published: true,
};

export default function ProjectForm({
  token,
  project,
}: {
  token: string;
  project?: Project;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(project ?? emptyProject);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) setForm(project);
  }, [project]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (project) {
        await adminApi.updateProject(token, project.id, form);
      } else {
        await adminApi.createProject(token, form);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-slate-200 bg-white/85 p-5">
      <label>
        Title
        <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
      </label>
      <label>
        Summary
        <input value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} required />
      </label>
      <label>
        Description
        <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={8} required />
      </label>
      <label>
        Tech stack
        <input value={form.techStack} onChange={(event) => setForm({ ...form, techStack: event.target.value })} placeholder="Java, Spring Boot, PostgreSQL" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          GitHub URL
          <input value={form.githubUrl} onChange={(event) => setForm({ ...form, githubUrl: event.target.value })} />
        </label>
        <label>
          Live URL
          <input value={form.liveUrl} onChange={(event) => setForm({ ...form, liveUrl: event.target.value })} />
        </label>
      </div>
      <label>
        Status
        <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectInput["status"] })}>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField label="Featured" checked={form.featured} onChange={(featured) => setForm({ ...form, featured })} />
        <CheckboxField label="Published" checked={form.published} onChange={(published) => setForm({ ...form, published })} />
      </div>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save project"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
