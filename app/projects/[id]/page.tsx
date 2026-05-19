import Link from "next/link";
import Card from "@/components/ui/card";
import { Badge, Tags } from "@/components/public/Badges";
import { publicApi } from "@/lib/api";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await publicApi.project(id);

  return (
    <main>
      <Card>
        <Link href="/projects" className="text-sm font-semibold text-teal-700">
          Back to projects
        </Link>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.featured ? <Badge>Featured</Badge> : null}
          <Badge>{project.status === "completed" ? "Completed" : "In progress"}</Badge>
        </div>
        <h1 className="mt-4 text-4xl">{project.title}</h1>
        <p className="mt-4 text-lg text-slate-700">{project.summary}</p>
        <div className="mt-6">
          <Tags value={project.techStack} />
        </div>
        <div className="prose-lite mt-8">
          <p>{project.description}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {project.githubUrl ? (
            <a href={project.githubUrl} className="button">
              GitHub
            </a>
          ) : null}
          {project.liveUrl ? (
            <a href={project.liveUrl} className="button">
              Live site
            </a>
          ) : null}
        </div>
      </Card>
    </main>
  );
}
