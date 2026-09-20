import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/admin";
import { isContentKind, type ContentRow } from "@/lib/content-types";
import { UUID_PATTERN } from "@/lib/content-validation";
import ContentEditor from "@/components/manage/ContentEditor";

export default async function EditPage({ params, searchParams }: {
  params: Promise<{ kind: string; id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { kind, id } = await params;
  if (!isContentKind(kind) || (id !== "new" && !UUID_PATTERN.test(id))) notFound();
  let entry: ContentRow | null = null;
  let markdown = "";
  if (id !== "new") {
    const { data, error } = await supabase.from(kind).select("*").eq("id", id).maybeSingle();
    if (error) throw new Error("Could not load the entry.");
    if (!data) notFound();
    entry = data;
    if (entry.md_path) {
      const { data: body, error: bodyError } = await supabase.storage.from("content").download(entry.md_path);
      // Never display an empty editor that could overwrite an existing file.
      // Also recover uploads whose final metadata save was interrupted.
      const missingNewFile = !entry.md_uploaded_at && bodyError && "code" in bodyError && bodyError.code === "NoSuchKey";
      if (bodyError && !missingNewFile) throw new Error("Could not load the Markdown. Reload before editing.");
      if (body) markdown = await body.text();
    } else {
      throw new Error("This entry has no Markdown path.");
    }
  }
  return <>
    <Link href="/manage">← Manage</Link>
    <h1 className="mt-6">{entry ? "Edit" : "New"} {kind === "projects" ? "project" : "thought"}</h1>
    {(await searchParams).saved === "1" && <p role="status" className="mt-4">{entry?.published ? "Published." : "Draft saved."}</p>}
    <ContentEditor key={entry?.id ?? "new"} kind={kind} id={entry?.id ?? randomUUID()} entry={entry} markdown={markdown} />
  </>;
}
