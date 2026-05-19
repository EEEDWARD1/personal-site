"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNotice from "@/components/admin/AdminNotice";
import BlogForm from "@/components/admin/BlogForm";
import { adminApi, BlogPost } from "@/lib/api";

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminGuard>
      {(token) => <EditBlog token={token} id={params.id} />}
    </AdminGuard>
  );
}

function EditBlog({ token, id }: { token: string; id: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .blog(token)
      .then((posts) => {
        const found = posts.find((item) => item.id === id);
        if (!found) throw new Error("Post not found.");
        setPost(found);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load post."))
      .finally(() => setLoading(false));
  }, [token, id]);

  return (
    <section className="grid gap-4">
      <h2 className="text-2xl">Edit post</h2>
      <AdminNotice loading={loading} error={error} />
      {post ? <BlogForm token={token} post={post} /> : null}
    </section>
  );
}
