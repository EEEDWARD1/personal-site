import ProjectCard from "@/components/public/ProjectCard";
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
    <main className="grid gap-5">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl">Projects</h1>
          <p className="mt-3 max-w-2xl">
            Published software projects, experiments, and practical builds.
          </p>
        </div>
        <a href={featured === "true" ? "/projects" : "/projects?featured=true"} className="button">
          {featured === "true" ? "Show all" : "Featured only"}
        </a>
      </header>
      {filtered.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <StatusMessage title="No projects found" message="Try clearing the featured filter." />
      )}
    </main>
  );
}
