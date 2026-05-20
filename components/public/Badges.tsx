import { splitCsv } from "@/lib/api";

export function Tags({ value }: { value?: string | null }) {
  return (
    <div className="flex flex-wrap gap-2">
      {splitCsv(value).map((tag) => (
        <span
          key={tag}
          className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700">
      {children}
    </span>
  );
}
