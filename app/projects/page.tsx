import ProjectCard from "@/components/public/ProjectCard";
import CardCarousel from "@/components/ui/card-carousel";
import SectionHeader from "@/components/ui/section-header";
import StatusMessage from "@/components/public/StatusMessage";
import { publicApi } from "@/lib/api";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ featured?: string }>;
}) {
  const [{ featured }, result] = await Promise.all([
    searchParams,
    publicApi.projects().then(
      (projects) => ({ projects, error: false }),
      () => ({ projects: [], error: true }),
    ),
  ]);

  if (result.error) {
    return (
      <StatusMessage
        title="Projects unavailable"
        message="The projects API could not be reached. Please try again shortly."
      />
    );
  }

  const filtered =
    featured === "true"
      ? result.projects.filter((project) => project.featured)
      : result.projects;

  return (
    <main className="grid gap-6 pb-8">
      <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <h1 className="text-4xl sm:text-5xl">Projects</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Published software projects, experiments, and practical builds.
          </p>
        </div>
        <a
          href={featured === "true" ? "/projects" : "/projects?featured=true"}
          className="button shrink-0 gap-2"
          aria-label={
            featured === "true"
              ? "Show all projects"
              : "Show featured projects only"
          }
        >
          <span>{featured === "true" ? "Show all" : "Featured only"}</span>
          <span
            aria-hidden="true"
            className="h-2 w-2 rotate-45 border-b-2 border-r-2 border-current"
          />
        </a>
      </header>
      {filtered.length ? (
        <section className="grid gap-4" aria-labelledby="projects-list-heading">
          <SectionHeader
            id="projects-list-heading"
            title={featured === "true" ? "Featured projects" : "All projects"}
          />
          <CardCarousel
            className="desktop-grid-2 desktop-grid-lg-3"
            label="Projects"
          >
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </CardCarousel>
        </section>
      ) : (
        <StatusMessage title="No projects found" message="Try clearing the featured filter." />
      )}
    </main>
  );
}
