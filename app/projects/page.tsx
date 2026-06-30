import { Suspense } from "react";
import {
  CardCollection,
  CardGridSkeleton,
} from "@/app/_components/card-collection";
import { ProjectCard } from "@/app/_components/content-cards";
import { PageHeader, SiteShell } from "@/app/_components/site-shell";
import { publicApi } from "@/app/_lib/api";
import { pageMetadata } from "@/app/_lib/metadata";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Software and web projects by Eduard Teodor, focused on practical systems that manage, publish, automate, or make workflows easier to run.",
});

export default function ProjectsPage() {
  return (
    <SiteShell>
      <main className="projects-page">
        <PageHeader eyebrow="Projects" title="What I've Built.">
          <p>
            A small collection of projects, that I have built over time.
          </p>
        </PageHeader>
        <Suspense fallback={<ListingCardsSkeleton />}>
          <ProjectCards />
        </Suspense>
      </main>
    </SiteShell>
  );
}

async function ProjectCards() {
  const projects = await publicApi.projects();

  return (
    <section className="section pt-0">
      <div className="section-inner">
        <CardCollection
          state={projects}
          emptyTitle="No projects published yet"
          renderItem={(project) => (
            <ProjectCard key={project.slug} project={project} />
          )}
        >
          Published work will appear here once it is added.
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
