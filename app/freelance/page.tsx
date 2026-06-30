import { Suspense } from "react";
import {
  CardCollection,
  CardGridSkeleton,
} from "@/app/_components/card-collection";
import { FreelanceCard } from "@/app/_components/content-cards";
import { SiteShell } from "@/app/_components/site-shell";
import { publicApi } from "@/app/_lib/api";
import { pageMetadata } from "@/app/_lib/metadata";

export const metadata = pageMetadata({
  title: "Freelance",
  description:
    "Focused freelance help from Eduard Teodor.",
});

export default function FreelancePage() {
  return (
    <SiteShell>
      <main>
        <section className="section freelance-hero">
          <div className="section-inner freelance-hero-inner">
            <div>
              <p className="eyebrow">Freelance</p>
              <h1 className="page-title">Focused help for practical digital work.</h1>
              <p className="lede">
                Focused freelance help from Eduard Teodor.
              </p>
            </div>
            <div className="freelance-note">
              <p>
                I am open to work on your next project.
                Enquire about what you need/want, and I will let you know honestly
                whether it matches what I can help with.
              </p>
              <a className="button button-dark" href="/contact">
                Enquire
              </a>
            </div>
          </div>
        </section>
        <Suspense fallback={<FreelanceCardsSkeleton />}>
          <FreelanceCards />
        </Suspense>
      </main>
    </SiteShell>
  );
}

async function FreelanceCards() {
  const items = await publicApi.freelance();

  return (
    <section className="section muted">
      <div className="section-inner">
        <div className="section-heading">
          <p className="eyebrow">Examples</p>
          <h2>Published freelance work.</h2>
        </div>
        <CardCollection
          state={items}
          emptyTitle="No examples published yet"
          renderItem={(item) => <FreelanceCard key={item.slug} item={item} />}
        >
          Freelance examples will appear here when they are available.
        </CardCollection>
      </div>
    </section>
  );
}

function FreelanceCardsSkeleton() {
  return (
    <section className="section muted">
      <div className="section-inner">
        <div className="section-heading" aria-hidden="true">
          <div className="skeleton-line skeleton-line-short" />
          <div className="skeleton-line skeleton-line-heading" />
        </div>
        <CardGridSkeleton />
      </div>
    </section>
  );
}
