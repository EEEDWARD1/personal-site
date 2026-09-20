import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isContentKind } from "@/lib/content-types";
import { getPublishedEntry, publishedMarkdown } from "@/lib/public-content";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Markdown from "@/components/Markdown";
import Tags from "@/components/Tags";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ kind: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind, slug } = await params;
  if (!isContentKind(kind)) notFound();
  const entry = await getPublishedEntry(kind, slug);
  if (!entry) notFound();
  return { title: `${entry.title} | Eduard Teodor`, description: entry.summary || entry.title };
}

export default async function ContentPage({ params }: Props) {
  const { kind, slug } = await params;
  if (!isContentKind(kind)) notFound();
  const entry = await getPublishedEntry(kind, slug);
  if (!entry) notFound();
  const markdown = await publishedMarkdown(entry);
  return <><Navigation /><main className="space-y-8 py-10 sm:py-12">
    <Link href="/">← Home</Link>
    <article>
      <header className="mb-8 space-y-4 border-b border-line pb-6">
        <p className="capitalize text-foreground/70">{kind}</p>
        <h1>{entry.title}</h1>
        {entry.summary && <p>{entry.summary}</p>}
        {entry.published_at && <time className="block text-sm text-foreground/70" dateTime={entry.published_at}>{new Date(entry.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>}
        <Tags tags={entry.tags} />
        {(entry.repo_url || entry.live_url) && <div className="flex flex-wrap gap-6">
          {entry.repo_url && /^https?:\/\//.test(entry.repo_url) && <a href={entry.repo_url} rel="noopener noreferrer" target="_blank">Repository ↗</a>}
          {entry.live_url && /^https?:\/\//.test(entry.live_url) && <a href={entry.live_url} rel="noopener noreferrer" target="_blank">Live project ↗</a>}
        </div>}
      </header>
      <Markdown>{markdown}</Markdown>
    </article>
  </main><Footer /></>;
}
