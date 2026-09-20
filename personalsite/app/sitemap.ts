import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { listPublished } from "@/lib/public-content";
import type { ContentKind, ContentRow } from "@/lib/content-types";

async function entriesFor(kind: ContentKind): Promise<MetadataRoute.Sitemap> {
  let rows: ContentRow[];
  try { rows = await listPublished(kind); }
  catch { return []; }
  return rows.map((row) => ({
    url: `${siteUrl}/${kind}/${row.slug}`,
    lastModified: row.updated_at,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, thoughts] = await Promise.all([
    entriesFor("projects"),
    entriesFor("thoughts"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/freelance`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticRoutes, ...projects, ...thoughts];
}
