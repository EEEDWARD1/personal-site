import BlogPostCard from "@/components/public/BlogPostCard";
import SectionHeader from "@/components/ui/section-header";
import StatusMessage from "@/components/public/StatusMessage";
import { publicApi } from "@/lib/api";

export default async function BlogPage() {
  const result = await publicApi.blog().then(
    (posts) => ({ posts, error: false }),
    () => ({ posts: [], error: true }),
  );

  if (result.error) {
    return (
      <StatusMessage
        title="Blog unavailable"
        message="The blog API could not be reached. Please try again shortly."
      />
    );
  }

  return (
    <main className="grid gap-6 pb-8">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:p-6">
        <h1 className="text-4xl sm:text-5xl">Blog</h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          Notes on software, infrastructure, learning, and projects in motion.
        </p>
      </header>
      {result.posts.length ? (
        <section className="grid gap-4" aria-labelledby="posts-list-heading">
          <SectionHeader id="posts-list-heading" title="Latest posts" />
          <div className="grid gap-4">
            {result.posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <StatusMessage title="No posts yet" message="Published posts will appear here." />
      )}
    </main>
  );
}
