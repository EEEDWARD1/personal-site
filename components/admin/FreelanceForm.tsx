"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, FreelanceWork, FreelanceWorkInput } from "@/lib/api";
import { CheckboxField } from "./fields";

const emptyEntry: FreelanceWorkInput = {
  clientName: "",
  projectTitle: "",
  description: "",
  services: "",
  testimonial: "",
  websiteUrl: "",
  featured: false,
  published: true,
  completedAt: new Date().toISOString(),
};

export default function FreelanceForm({
  token,
  entry,
}: {
  token: string;
  entry?: FreelanceWork;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FreelanceWorkInput>(entry ?? emptyEntry);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (entry) setForm(entry);
  }, [entry]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (entry) {
        await adminApi.updateFreelance(token, entry.id, form);
      } else {
        await adminApi.createFreelance(token, form);
      }
      router.push("/admin/freelance");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save entry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-slate-200 bg-white/85 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          Client name
          <input value={form.clientName} onChange={(event) => setForm({ ...form, clientName: event.target.value })} />
        </label>
        <label>
          Project title
          <input value={form.projectTitle} onChange={(event) => setForm({ ...form, projectTitle: event.target.value })} required />
        </label>
      </div>
      <label>
        Description
        <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={7} required />
      </label>
      <label>
        Services
        <input value={form.services} onChange={(event) => setForm({ ...form, services: event.target.value })} placeholder="Next.js, Tailwind CSS, Hosting" />
      </label>
      <label>
        Testimonial
        <textarea value={form.testimonial ?? ""} onChange={(event) => setForm({ ...form, testimonial: event.target.value })} rows={3} />
      </label>
      <label>
        Website URL
        <input value={form.websiteUrl ?? ""} onChange={(event) => setForm({ ...form, websiteUrl: event.target.value })} />
      </label>
      <label>
        Completed at
        <input
          type="datetime-local"
          value={(form.completedAt ?? "").slice(0, 16)}
          onChange={(event) =>
            setForm({
              ...form,
              completedAt: event.target.value
                ? new Date(event.target.value).toISOString()
                : null,
            })
          }
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField label="Featured" checked={form.featured} onChange={(featured) => setForm({ ...form, featured })} />
        <CheckboxField label="Published" checked={form.published} onChange={(published) => setForm({ ...form, published })} />
      </div>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save entry"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
