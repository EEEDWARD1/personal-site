import { FreelanceWork, formatDate } from "@/lib/api";
import { Badge, Tags } from "./Badges";

export default function FreelanceCard({ work }: { work: FreelanceWork }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70 transition duration-200 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md hover:shadow-slate-200/80">
      <div className="flex flex-wrap items-center gap-2">
        {work.featured ? <Badge>Featured</Badge> : null}
        <span className="text-sm text-slate-500">{formatDate(work.completedAt)}</span>
      </div>
      <h2 className="mt-4 text-xl">{work.projectTitle}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {work.clientName || "Private client"}
      </p>
      <p className="mt-4 flex-1 text-sm leading-7 text-slate-600 sm:text-base">
        {work.description}
      </p>
      <div className="mt-4">
        <Tags value={work.services} />
      </div>
      {work.testimonial ? (
        <blockquote className="mt-4 rounded-r-md border-l-2 border-teal-400 bg-teal-50/60 py-2 pl-4 text-sm leading-7 text-slate-700">
          {work.testimonial}
        </blockquote>
      ) : null}
      {work.websiteUrl ? (
        <a
          href={work.websiteUrl}
          className="mt-4 inline-block text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
        >
          Visit website
        </a>
      ) : null}
    </article>
  );
}
