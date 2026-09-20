import { isContentKind } from "./content-types";

export const MAX_MARKDOWN_BYTES = 2 * 1024 * 1024;
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function field(form: FormData, name: string) {
  const value = form.get(name);
  if (typeof value !== "string") throw new Error(`Missing ${name}.`);
  return value.trim();
}

function optionalUrl(form: FormData, name: string) {
  const value = field(form, name);
  if (!value) return null;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error();
    return url.toString();
  } catch {
    throw new Error("Project links must be valid http:// or https:// URLs without credentials.");
  }
}

export function parseContentForm(form: FormData) {
  const kind = field(form, "kind");
  const id = field(form, "id");
  if (!isContentKind(kind) || !UUID_PATTERN.test(id)) throw new Error("Invalid entry.");
  const title = field(form, "title");
  const slug = field(form, "slug");
  if (!title || title.length > 200) throw new Error("Enter a title of up to 200 characters.");
  if (!SLUG_PATTERN.test(slug) || slug.length > 160) throw new Error("Use a slug of up to 160 lowercase letters, numbers and single hyphens.");
  const rawMarkdown = form.get("markdown");
  if (typeof rawMarkdown !== "string") throw new Error("Missing Markdown content.");
  if (new TextEncoder().encode(rawMarkdown).byteLength > MAX_MARKDOWN_BYTES) throw new Error("Markdown must be 2 MB or smaller.");
  const published = form.get("published") === "on";
  if (published && !rawMarkdown.trim()) throw new Error("Add some Markdown before publishing.");
  const tags = [...new Set(field(form, "tags").split(",").map((tag) => tag.trim()).filter(Boolean))];
  if (tags.length > 30 || tags.some((tag) => tag.length > 60)) throw new Error("Use up to 30 tags, each 60 characters or fewer.");
  const summary = kind === "projects" ? field(form, "summary") : undefined;
  if (kind === "projects" && (!summary || summary.length > 1000)) throw new Error("Enter a project summary of up to 1,000 characters.");
  return {
    kind, id, markdown: rawMarkdown, published,
    metadata: {
      title, slug, tags, featured: form.get("featured") === "on",
      ...(kind === "projects" ? { summary: summary!, repo_url: optionalUrl(form, "repo_url"), live_url: optionalUrl(form, "live_url") } : {}),
    },
  };
}
