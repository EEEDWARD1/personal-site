import { CardGridSkeleton } from "@/app/_components/card-collection";
import { SiteShell } from "@/app/_components/site-shell";

export default function Loading() {
  return (
    <SiteShell>
      <main>
        <section className="section hero-section">
          <div className="section-inner hero-wrap">
            <div className="hero-copy-block" aria-hidden="true">
              <div className="skeleton-line skeleton-line-short" />
              <div className="skeleton-line skeleton-line-hero" />
              <div className="skeleton-line skeleton-line-hero-medium" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-medium" />
            </div>
          </div>
        </section>
        <section className="section section-compact muted">
          <div className="section-inner">
            <CardGridSkeleton />
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
