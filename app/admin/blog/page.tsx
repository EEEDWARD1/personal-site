"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import { adminApi, BlogPost, formatDate } from "@/lib/api";

export default function AdminBlogPage() {
  return <AdminGuard>{(token) => <BlogManager token={token} />}</AdminGuard>;
}

function BlogManager({ token }: { token: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    adminApi
      .blog(token)
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load posts."))
      .finally(() => setLoading(false));
  }

  useEffect(load, [token]);

  async function remove(id: string) {
    if (!window.confirm("Delete this post?")) return;
    setLoading(true);
    await adminApi.deleteBlog(token, id);
    load();
  }

  async function star(id: string) {
    setLoading(true);
    await adminApi.toggleBlogStar(token, id);
    load();
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">Blog posts</h2>
        <Link href="/admin/blog/new" className="button">
          New post
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
                <th className="p-3">Published</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="p-3">
                    <p className="font-semibold text-slate-900">{post.title}</p>
                    <p className="text-xs text-slate-500">/{post.slug}</p>
                  </td>
                  <td className="p-3">{post.published ? "Published" : "Draft"}{post.starred ? " / Starred" : ""}</td>
                  <td className="p-3">{formatDate(post.publishedAt)}</td>
                  <td className="flex flex-wrap gap-2 p-3">
                    <Link href={`/admin/blog/${post.id}/edit`} className="button px-3 py-1 text-xs">
                      Edit
                    </Link>
                    <button type="button" onClick={() => star(post.id)} className="px-3 py-1 text-xs">
                      {post.starred ? "Unstar" : "Star"}
                    </button>
                    <button type="button" onClick={() => remove(post.id)} className="px-3 py-1 text-xs">
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
