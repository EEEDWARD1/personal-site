import type { Metadata } from "next";
import Link from "next/link";
import { getAdmin } from "@/lib/supabase/admin";
import { contentKinds } from "@/lib/content-types";
import { SignInForm, SignOutForm } from "@/components/manage/AuthForms";

export const metadata: Metadata = {
  title: "Manage | Eduard Teodor",
  description: "Sign in to manage your website.",
  robots: { index: false, follow: false },
};

export default async function Manage() {
  const { supabase, user } = await getAdmin();
  if (!user) return <><h1>Sign in</h1><p className="mt-4">Manage your projects and thoughts.</p><SignInForm /></>;
  const sections = await Promise.all(contentKinds.map(async (kind) => ({
    kind, result: await supabase.from(kind).select("id,title,published,featured,updated_at").order("updated_at", { ascending: false }),
  })));
  return <>
    <div className="flex flex-wrap items-center justify-between gap-5"><h1>Manage</h1><SignOutForm /></div>
    <p className="mt-4">Signed in as {user.email}.</p>
    <div className="mt-8 space-y-8">
      {sections.map(({ kind, result }) => <section key={kind} className="block-panel">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="capitalize">{kind}</h2>
          <Link href={`/manage/${kind}/new`} className="block-button">New {kind === "projects" ? "project" : "thought"}</Link>
        </div>
        {result.error ? <p className="mt-5" role="alert">Could not load {kind}. Reload to try again.</p> : !result.data.length ? <p className="mt-5">No {kind} yet.</p> :
          <ul className="mt-5 divide-y divide-line">{result.data.map((entry) => <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <Link href={`/manage/${kind}/${entry.id}`}>{entry.title}</Link>
            <span className="text-sm text-foreground/70">{entry.published ? "Published" : "Draft"}{entry.featured ? " · Featured" : ""}</span>
          </li>)}</ul>}
      </section>)}
    </div>
  </>;
}
