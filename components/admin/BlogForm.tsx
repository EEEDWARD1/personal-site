"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi, BlogPost, BlogPostInput } from "@/lib/api";
import { CheckboxField, slugify } from "./fields";

const emptyPost: BlogPostInput = {
  slug: "",
  title: "",
  content: "",
  excerpt: "",
  starred: false,
  published: false,
  publishedAt: new Date().toISOString(),
};

export default function BlogForm({
  token,
  post,
}: {
  token: string;
  post?: BlogPost;
}) {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostInput>(post ?? emptyPost);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (post) setForm(post);
  }, [post]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (post) {
        await adminApi.updateBlog(token, post.id, form);
      } else {
        await adminApi.createBlog(token, form);
      }
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-slate-200 bg-white/85 p-5">
      <label>
        Title
        <input
          value={form.title}
          onChange={(event) => {
            const title = event.target.value;
            setForm((current) => ({
              ...current,
              title,
              slug: current.slug ? current.slug : slugify(title),
            }));
          }}
          required
        />
      </label>
      <label>
        Slug
        <input
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })}
          required
        />
      </label>
      <label>
        Excerpt
        <textarea
          value={form.excerpt}
          onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
          rows={3}
          required
        />
      </label>
      <label>
        Content
        <textarea
          value={form.content}
          onChange={(event) => setForm({ ...form, content: event.target.value })}
          rows={14}
          required
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField
          label="Published"
          checked={form.published}
          onChange={(published) => setForm({ ...form, published })}
        />
        <CheckboxField
          label="Starred"
          checked={form.starred}
          onChange={(starred) => setForm({ ...form, starred })}
        />
      </div>
      <label>
        Published at
        <input
          type="datetime-local"
          value={(form.publishedAt ?? "").slice(0, 16)}
          onChange={(event) =>
            setForm({
              ...form,
              publishedAt: event.target.value
                ? new Date(event.target.value).toISOString()
                : null,
            })
          }
        />
      </label>
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save post"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </form>
  );
}
