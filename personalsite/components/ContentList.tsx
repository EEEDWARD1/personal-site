import Link from "next/link";
import Tags from "./Tags";
import type { ContentKind } from "@/lib/content-types";
import { listPublished } from "@/lib/public-content";

export default async function ContentList({ kind }: { kind: ContentKind }) {
  let entries;
  try { entries = await listPublished(kind); }
  catch { return <p role="status" className="mt-3 text-foreground/70">{kind === "projects" ? "Projects" : "Thoughts"} are temporarily unavailable. Please try again shortly.</p>; }
  if (!entries.length) return <p className="mt-3 text-foreground/70">{kind === "projects" ? "Project write-ups" : "Notes and thoughts"} coming soon.</p>;
  if (kind === "thoughts") {
    return <ul className="mt-5 space-y-3">
      {entries.map((entry) => <li key={entry.id}>
        <Link href={`/thoughts/${entry.slug}`} className="font-bold text-black underline underline-offset-3 hover:text-black dark:text-foreground dark:hover:text-foreground">
          {entry.title}
        </Link>
      </li>)}
    </ul>;
  }
  return <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
    {entries.map((entry) => <li key={entry.id} className="flex min-w-0 flex-col gap-2 rounded-sm bg-foreground/5 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="min-w-0 break-words">
          <Link href={`/projects/${entry.slug}`} className="font-bold text-foreground hover:text-foreground">{entry.title}</Link>
        </h3>
        {entry.featured && <span className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Featured</span>}
      </div>
      {entry.summary && <p className="break-words text-sm! leading-relaxed!">{entry.summary}</p>}
      {!!entry.tags.length && <div className="mt-auto pt-3"><Tags tags={entry.tags.slice(0, 3)} /></div>}
    </li>)}
  </ul>;
}
