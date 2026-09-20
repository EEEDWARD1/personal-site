# Eduard Teodor — personal site

Next.js App Router site with Supabase Auth, Projects, Thoughts and Markdown stored in the `content` bucket.

## Local setup

Run commands from `personalsite`:

```sh
pnpm install
cp .env.example .env.local
pnpm dev
```

Set these environment variables in `.env.local` and in the hosting provider's build/runtime environment:

- `NEXT_PUBLIC_SUPABASE_URL`: `https://cidvwrdpmacuxjlywvhy.supabase.co` (the project root, without `/rest/v1`).
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable key from `SUPABASE.env`.
- `SUPABASE_ADMIN_EMAIL`: `ed@eduardteodor.co.uk`.

The working copy's `.env.local` has already been configured from `SUPABASE.env`. Neither file is committed. Next.js does not load `SUPABASE.env` automatically. No service-role key or database password is needed by the app.

## Supabase setup

The app uses the existing `projects` and `thoughts` tables and `content` bucket supplied in migrations 0001/0002. It does not recreate those tables or change `md_path`; both generated-column and default-value variants are supported.

Apply `supabase/migrations/0003_private_content.sql` in the Supabase SQL editor after your existing migrations. This file has been prepared locally, **not applied to the remote project**. It:

- Makes `content` private and permits anonymous downloads only for files belonging to published entries.
- Preserves authenticated owner access to draft files.
- Restricts the existing `is_admin()` helper to `ed@eduardteodor.co.uk`, matching the application's owner check. If you change the owner email, update both this function and the environment variable.

The app also supports the existing public bucket until this migration is applied. With a public bucket, anyone possessing a file URL can still read it after unpublishing; UUID paths and disabled listing do not enforce privacy. Previously public/CDN-cached copies cannot be recalled by changing bucket permissions.

Apply `supabase/migrations/0004_storage_delete.sql` before using permanent deletion. It removes the original direct SQL Storage deletion triggers without deleting any entries or files. The application removes the actual Markdown file using the Storage API before deleting the row. This migration is prepared locally and must be applied in the SQL editor.

Keep signups disabled and use the owner account already created in Supabase Authentication. There is no signup flow in the application.

## Editing and publishing

Visit `/manage` and sign in with your Supabase email and password. Create or edit projects and thoughts, import a `.md` file or write Markdown, preview it, set tags/featured status, and save as draft or publish. Project entries also include a summary and optional repository/live URLs. Uncheck Published and save to unpublish. To permanently delete an entry, use Delete project / Delete thought at the bottom of its editor, then confirm. Deletion first unpublishes the entry, removes its Markdown file, then deletes its row. A failed deletion leaves a draft where possible; retry to finish.

The homepage reads published rows only. Full entries appear at `/projects/[slug]` and `/thoughts/[slug]`. Only detail pages download Markdown; lists use table columns. Public reads use a separate anonymous client even while the owner is signed in. Markdown is rendered with GitHub-flavored Markdown support; raw HTML is not rendered.

Each save first saves metadata as a draft, then uploads Markdown (maximum 2 MiB), then sets the upload/publication timestamps and requested publication status. Database writes and Storage uploads are separate requests. If an upload or final write fails, the entry remains a draft, the editor retains the text, and saving again uses the same ID. An already published entry is briefly unpublished while saving. The first publication date is preserved when editing or republishing. Avoid editing the same entry in multiple tabs at once.

Auth uses server-verified users, HTTP-only cookies, session refresh through `proxy.ts`, and uncached admin responses. Every save checks the owner email again; Supabase RLS independently enforces database and storage access.

## Microsoft Clarity

The site initializes `@microsoft/clarity` once in the browser through the root layout, following the [package guide](https://www.npmjs.com/package/@microsoft/clarity). Set `NEXT_PUBLIC_CLARITY_PROJECT_ID` to the project ID from Clarity > Settings > Overview in the hosting provider's build environment, then rebuild and deploy. For a local production preview, set it in `.env.local` and run `pnpm build` followed by `pnpm start`.

Analytics is disabled during `pnpm dev`, when the project ID is empty, and until the visitor accepts analytics. The cookie banner gives equally styled Accept and Reject controls. Choices are stored locally for 180 days; the footer's Cookie settings control lets visitors change them. Acceptance initializes Clarity and sends analytics consent granted / advertising consent denied. Withdrawal sends denied consent, clears the site's `_clck` and `_clsk` cookies and reloads to unload the recorder. No custom events or user identifiers are sent. The `/privacy` page describes this behaviour.

In Clarity Settings > Setup, turn off setting cookies by default (enable Consent Mode) for all visitors. The site already blocks loading before acceptance; the dashboard setting also ensures Clarity respects consent signals. A browser visit to the production build is needed to verify data arriving in the dashboard.

## Checks

```sh
pnpm test
pnpm lint
pnpm build
```

Tests cover input validation, generated-column compatibility, publish ordering, upload/final-write failures, retrying, duplicate slugs, and unpublishing. They use a fake Supabase client and do not write to the live project.

For an authenticated smoke check, sign in at `/manage`, create a draft in each section, save and reload its Markdown, publish and open the public URL while signed out, then unpublish and verify the public route returns 404. After migration 0003, verify the old public Storage URL no longer exposes the draft. This live authenticated check requires your account; no password is stored in the repository.

## References

- [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
