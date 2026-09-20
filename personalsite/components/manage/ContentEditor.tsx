"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { deleteContent, saveContent } from "@/app/manage/actions";
import type { ContentKind, ContentRow } from "@/lib/content-types";
import { MAX_MARKDOWN_BYTES } from "@/lib/content-validation";
import Markdown from "@/components/Markdown";

export default function ContentEditor({ kind, id, entry, markdown }: {
  kind: ContentKind; id: string; entry: ContentRow | null; markdown: string;
}) {
  const [state, action, pending] = useActionState(saveContent, {});
  const [deleteState, deleteAction, deleting] = useActionState(deleteContent, {});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [entryId] = useState(id);
  const [values, setValues] = useState({
    title: entry?.title ?? "", slug: entry?.slug ?? "", tags: entry?.tags.join(", ") ?? "",
    summary: entry?.summary ?? "", repo_url: entry?.repo_url ?? "", live_url: entry?.live_url ?? "",
    markdown, featured: entry?.featured ?? false, published: entry?.published ?? false,
  });
  const [preview, setPreview] = useState(false);
  const [fileError, setFileError] = useState("");
  const [readingFile, setReadingFile] = useState(false);
  function textField(name: "title" | "slug" | "tags" | "summary" | "repo_url" | "live_url") {
    return { name, value: values[name], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues({ ...values, [name]: event.target.value }), className: "editor-input" };
  }
  return <><form action={action} className="mt-8 space-y-6">
    <input type="hidden" name="kind" value={kind} /><input type="hidden" name="id" value={entryId} />
    <fieldset disabled={pending || readingFile || deleting} className="space-y-6">
      <label className="block">Title<input {...textField("title")} required maxLength={200} /></label>
      <label className="block">Slug<input {...textField("slug")} required maxLength={160} pattern="[a-z0-9]+(-[a-z0-9]+)*" aria-describedby="slug-help" /><span id="slug-help" className="mt-1 block text-sm text-foreground/70">Lowercase letters, numbers and hyphens. Used in /{kind}/your-slug.</span></label>
      {kind === "projects" && <>
        <label className="block">Summary<textarea {...textField("summary")} required maxLength={1000} rows={3} /></label>
        <label className="block">Repository URL<input {...textField("repo_url")} type="url" placeholder="https://github.com/…" /></label>
        <label className="block">Live URL<input {...textField("live_url")} type="url" placeholder="https://…" /></label>
      </>}
      <label className="block">Tags<input {...textField("tags")} placeholder="design, development" /><span className="mt-1 block text-sm text-foreground/70">Separate tags with commas.</span></label>
      <label className="block">Import a Markdown file
        <input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" className="editor-input" onChange={async (event) => {
          const file = event.target.files?.[0]; event.target.value = "";
          if (!file) return;
          if (file.size > MAX_MARKDOWN_BYTES) { setFileError("Choose a Markdown file of 2 MB or smaller."); return; }
          setReadingFile(true); setFileError("");
          try { const text = await file.text(); setValues((current) => ({ ...current, markdown: text })); }
          catch { setFileError("Could not read this file. Try again."); }
          finally { setReadingFile(false); }
        }} />
      </label>
      {fileError && <p role="alert">{fileError}</p>}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3"><label htmlFor="markdown">Markdown</label><button type="button" onClick={() => setPreview(!preview)} className="underline">{preview ? "Hide preview" : "Show preview"}</button></div>
        <textarea id="markdown" name="markdown" rows={20} value={values.markdown} onChange={(event) => setValues({ ...values, markdown: event.target.value })} className="editor-input font-mono text-sm" spellCheck={false} />
        {preview && <div className="block-panel mt-4"><h2 className="mb-4">Preview</h2><Markdown>{values.markdown}</Markdown></div>}
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" checked={values.featured} onChange={(event) => setValues({ ...values, featured: event.target.checked })} />Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="published" checked={values.published} onChange={(event) => setValues({ ...values, published: event.target.checked })} />Published</label>
      </div>
      <p className="text-sm text-foreground/70">Uncheck Published and save to return an entry to drafts.</p>
      {state.error && <p role="alert">{state.error}</p>}
      <div className="flex flex-wrap items-center gap-6">
        <button className="block-button" disabled={pending || readingFile}>{pending ? "Saving…" : readingFile ? "Reading file…" : values.published ? "Save and publish" : "Save draft"}</button>
        {entry?.published && <Link href={`/${kind}/${entry.slug}`} target="_blank" rel="noopener noreferrer">View published entry ↗</Link>}
      </div>
    </fieldset>
  </form>
    {(entry || state.id) && <section className="mt-10 border-t border-line pt-6" aria-label="Delete entry">
      {!confirmDelete ? <button type="button" disabled={pending || readingFile || deleting} onClick={() => setConfirmDelete(true)} className="border border-line px-4 py-2 font-semibold text-red-700 dark:text-red-400">
        Delete {kind === "projects" ? "project" : "thought"}
      </button> : <form action={deleteAction} className="space-y-4">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="id" value={entryId} />
        <input type="hidden" name="confirmed" value="yes" />
        <p>Permanently delete &ldquo;{entry?.title ?? values.title}&rdquo; and its Markdown file? This cannot be undone.</p>
        <div className="flex flex-wrap gap-4">
          <button disabled={deleting || pending || readingFile} className="border border-red-700 bg-red-700 px-4 py-2 font-semibold text-white">{deleting ? "Deleting…" : "Permanently delete"}</button>
          <button type="button" disabled={deleting} onClick={() => setConfirmDelete(false)} className="border border-line px-4 py-2">Cancel</button>
        </div>
        {deleteState.error && <p role="alert">{deleteState.error}</p>}
      </form>}
    </section>}
  </>;
}
