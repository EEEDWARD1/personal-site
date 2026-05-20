import type { MetadataRoute } from "next";
import { publicApi } from "@/lib/api";

const SITE_URL = "https://eduardteodor.co.uk";

function route(path: string, lastModified = new Date()): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, SITE_URL).toString(),
    lastModified,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    route("/"),
    route("/projects"),
    route("/blog"),
    route("/freelance"),
    route("/contact"),
  ];

  const [projectsResult, postsResult] = await Promise.allSettled([
    publicApi.projects(),
    publicApi.blog(),
  ]);

  const projectRoutes: MetadataRoute.Sitemap =
    projectsResult.status === "fulfilled"
      ? projectsResult.value
          .filter((project) => project.published)
          .map((project) => route(`/projects/${project.id}`, new Date(project.updatedAt)))
      : [];

  const blogRoutes: MetadataRoute.Sitemap =
    postsResult.status === "fulfilled"
      ? postsResult.value
          .filter((post) => post.published)
          .map((post) =>
            route(`/blog/${post.slug}`, new Date(post.updatedAt ?? post.publishedAt ?? post.createdAt)),
          )
      : [];

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
