import Link from "next/link";
import { BlogPost, formatDate } from "@/lib/api";
import { Badge } from "./Badges";

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md hover:shadow-slate-200/80">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <time dateTime={post.publishedAt ?? post.createdAt}>
          {formatDate(post.publishedAt ?? post.createdAt)}
        </time>
        {post.starred ? <Badge>Starred</Badge> : null}
      </div>
      <h2 className="mt-3 text-xl">
        <Link
          href={`/blog/${post.slug}`}
          className="transition-colors hover:text-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
        {post.excerpt}
      </p>
    </article>
  );
}
