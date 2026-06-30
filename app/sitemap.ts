import type { MetadataRoute } from "next";
import { publicApi } from "@/app/_lib/api";
import { siteUrl } from "@/app/_lib/metadata";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: siteUrl,
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    url: `${siteUrl}/projects`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${siteUrl}/freelance`,
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${siteUrl}/blog`,
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${siteUrl}/contact`,
    changeFrequency: "yearly",
    priority: 0.6,
  },
];

function validLastModified(...dates: Array<string | undefined>) {
  const date = dates.find((value) => {
    if (!value) {
      return false;
    }

    return !Number.isNaN(new Date(value).getTime());
  });

  return date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, freelance] = await Promise.all([
    publicApi.posts(),
    publicApi.projects(),
    publicApi.freelance(),
  ]);

  return [
    ...staticRoutes,
    ...(posts.ok
      ? posts.data.map((post) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: validLastModified(
            post.updatedAt,
            post.publishedAt,
            post.createdAt,
          ),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      : []),
    ...(projects.ok
      ? projects.data.map((project) => ({
          url: `${siteUrl}/projects/${project.slug}`,
          lastModified: validLastModified(project.updatedAt, project.createdAt),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : []),
    ...(freelance.ok
      ? freelance.data.map((item) => ({
          url: `${siteUrl}/freelance/${item.slug}`,
          lastModified: validLastModified(
            item.updatedAt,
            item.completedAt,
            item.createdAt,
          ),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      : []),
  ];
}
