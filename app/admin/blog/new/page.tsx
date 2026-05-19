"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <AdminGuard>
      {(token) => (
        <section className="grid gap-4">
          <h2 className="text-2xl">Create post</h2>
          <BlogForm token={token} />
        </section>
      )}
    </AdminGuard>
  );
}
