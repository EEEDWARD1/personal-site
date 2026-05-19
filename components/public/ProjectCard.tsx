import Link from "next/link";
import { Project } from "@/lib/api";
import { Badge, Tags } from "./Badges";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col rounded-md border border-slate-200 bg-white/85 p-5 shadow-sm shadow-slate-200/70 transition-colors hover:border-teal-200">
      <div className="flex flex-wrap items-center gap-2">
        {project.featured ? <Badge>Featured</Badge> : null}
        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700">
          {project.status === "completed" ? "Completed" : "In progress"}
        </span>
      </div>
      <h2 className="mt-4 text-xl">
        <Link href={`/projects/${project.id}`} className="hover:text-teal-700">
          {project.title}
        </Link>
      </h2>
      <p className="mt-3 flex-1">{project.summary || project.description}</p>
      <div className="mt-4">
        <Tags value={project.techStack} />
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        {project.githubUrl ? (
          <a href={project.githubUrl} className="text-teal-700 hover:text-teal-900">
            GitHub
          </a>
        ) : null}
        {project.liveUrl ? (
          <a href={project.liveUrl} className="text-teal-700 hover:text-teal-900">
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}
