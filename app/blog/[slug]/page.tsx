import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Card from "@/components/ui/card";
import { formatDate, publicApi } from "@/lib/api";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await publicApi.blogPost(slug);

  return (
    <main>
      <Card>
        <Link href="/blog" className="text-sm font-semibold text-teal-700">
          Back to blog
        </Link>
        <h1 className="mt-4 text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {formatDate(post.publishedAt ?? post.createdAt)}
        </p>
        <article className="prose-lite mt-8">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </Card>
    </main>
  );
}
