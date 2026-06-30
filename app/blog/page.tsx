import { Suspense } from "react";
import {
  CardCollection,
  CardGridSkeleton,
} from "@/app/_components/card-collection";
import { PostCard } from "@/app/_components/content-cards";
import { PageHeader, SiteShell } from "@/app/_components/site-shell";
import { publicApi } from "@/app/_lib/api";
import { pageMetadata } from "@/app/_lib/metadata";

export const metadata = pageMetadata({
  title: "Notes",
  description:
    "Short notes from Eduard Teodor on building, learning.",
});

export default function BlogPage() {
  return (
    <SiteShell>
      <main>
        <PageHeader eyebrow="Writing" title="Thoughts and Ideas.">
          <p>
            Short notes on building, learning, and solving practical problems.
          </p>
        </PageHeader>
        <Suspense fallback={<ListingCardsSkeleton />}>
          <BlogCards />
        </Suspense>
      </main>
    </SiteShell>
  );
}

async function BlogCards() {
  const posts = await publicApi.posts();

  return (
    <section className="section pt-0">
      <div className="section-inner">
        <CardCollection
          state={posts}
          emptyTitle="No notes published yet"
          renderItem={(post) => <PostCard key={post.slug} post={post} />}
        >
          Published writing will appear here once it is available.
        </CardCollection>
      </div>
    </section>
  );
}

function ListingCardsSkeleton() {
  return (
    <section className="section pt-0">
      <div className="section-inner">
        <CardGridSkeleton />
      </div>
    </section>
  );
}
