import Link from "next/link";
import { BlogPost, formatDate } from "@/lib/api";
import { Badge } from "./Badges";

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-md border border-slate-200 bg-white/85 p-5 shadow-sm shadow-slate-200/70 transition-colors hover:border-teal-200">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <time dateTime={post.publishedAt ?? post.createdAt}>
          {formatDate(post.publishedAt ?? post.createdAt)}
        </time>
        {post.starred ? <Badge>Starred</Badge> : null}
      </div>
      <h2 className="mt-3 text-xl">
        <Link href={`/blog/${post.slug}`} className="hover:text-teal-700">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3">{post.excerpt}</p>
    </article>
  );
}
