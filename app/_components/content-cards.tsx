import Image from "next/image";
import Link from "next/link";
import type { BlogPost, FreelanceProject, Project } from "@/app/_lib/api";
import { splitCommaList } from "@/app/_lib/format";

export function ProjectCard({ project }: { project: Project }) {
  const tools = splitCommaList(project.techStack);
  const imageUrl = project.thumbnailUrl || project.heroUrl;

  return (
    <Link href={`/projects/${project.slug}`} className="content-card card-link">
      {imageUrl ? (
        <Image
          className="card-media"
          src={imageUrl}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          unoptimized
        />
      ) : null}
      <p className="eyebrow">{project.status || "Project"}</p>
      <h3>{project.title}</h3>
      <p>
        {project.summary || "A practical system designed around a clear need."}
      </p>
      {tools.length ? (
        <ul className="pill-list" aria-label="Tech stack">
          {tools.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      ) : null}
      <span className="text-link card-action">Read more</span>
    </Link>
  );
}

export function FreelanceCard({ item }: { item: FreelanceProject }) {
  const imageUrl = item.thumbnailUrl || item.heroUrl;

  return (
    <Link href={`/freelance/${item.slug}`} className="content-card card-link">
      {imageUrl ? (
        <Image
          className="card-media"
          src={imageUrl}
          alt=""
          width={640}
          height={360}
          loading="lazy"
          unoptimized
        />
      ) : null}
      <p className="eyebrow">{item.clientName || "Client work"}</p>
      <h3>{item.projectTitle}</h3>
      <p>{item.summary || "Practical help with a focused digital build."}</p>
      {item.services?.length ? (
        <ul className="pill-list" aria-label="Services">
          {item.services.slice(0, 4).map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      ) : null}
      <span className="text-link card-action">Read more</span>
    </Link>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="content-card card-link">
      <p className="eyebrow">Note</p>
      <h3>{post.title}</h3>
      <p>
        {post.excerpt ||
          "Notes on building, learning, and solving practical technical problems."}
      </p>
      <span className="text-link card-action">Read more</span>
    </Link>
  );
}
