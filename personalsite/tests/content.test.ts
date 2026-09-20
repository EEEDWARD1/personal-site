import assert from "node:assert/strict";
import { test } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/content-types";
import { MAX_MARKDOWN_BYTES, parseContentForm } from "../lib/content-validation";
import { persistContent } from "../lib/save-content";

const id = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  Object.entries({ kind: "projects", id, title: "My project", slug: "my-project", tags: "web, design, web", summary: "A project.", repo_url: "https://github.com/example/project", live_url: "", markdown: "# Hello\n\nBody.", ...overrides }).forEach(([key, value]) => data.set(key, value));
  return data;
}

test("normalizes tags and links without changing Markdown whitespace", () => {
  const input = parseContentForm(form({ markdown: "  indented\n\n" }));
  assert.deepEqual(input.metadata.tags, ["web", "design"]);
  assert.equal(input.metadata.live_url, null);
  assert.equal(input.markdown, "  indented\n\n");
});

test("thoughts never send project-only columns or generated md_path", () => {
  const input = parseContentForm(form({ kind: "thoughts" }));
  assert.equal("summary" in input.metadata, false);
  assert.equal("md_path" in input.metadata, false);
});

test("rejects invalid kinds, IDs, slugs, unsafe URLs and empty published bodies", () => {
  const invalidForms: Record<string, string>[] = [{ kind: "users" }, { id: "../other" }, { slug: "Bad Slug" }, { slug: "double--dash" }, { repo_url: "javascript:alert(1)" }, { live_url: "https://user:pass@example.com" }, { published: "on", markdown: "  " }, { summary: "" }];
  for (const invalid of invalidForms) {
    assert.throws(() => parseContentForm(form(invalid)));
  }
});

test("enforces the Storage limit in UTF-8 bytes", () => {
  assert.throws(() => parseContentForm(form({ markdown: "é".repeat(MAX_MARKDOWN_BYTES / 2 + 1) })), /2 MB/);
  assert.doesNotThrow(() => parseContentForm(form({ markdown: "" })));
});

type Row = Record<string, unknown>;
function fakeSupabase({ previous = null, failure = "" }: { previous?: Row | null; failure?: "read" | "draft" | "upload" | "finish" | "" } = {}) {
  const events: { operation: string; value?: Row }[] = [];
  let row: Row | null = previous;
  let writes = 0;
  const client = {
    from() {
      let operation = "read";
      let payload: Row = {};
      const query = {
        select() { return query; },
        eq() { return query; },
        update(value: Row) { operation = "update"; payload = value; return query; },
        insert(value: Row) { operation = "insert"; payload = value; return query; },
        async maybeSingle() { events.push({ operation: "read" }); return { data: row, error: failure === "read" ? { code: "offline" } : null }; },
        async single() {
          writes++;
          events.push({ operation, value: payload });
          const failed = (writes === 1 && failure === "draft") || (writes === 2 && failure === "finish");
          if (failed) return { data: null, error: { code: "23505" } };
          row = { id, md_path: `projects/${id}.md`, ...row, ...payload };
          return { data: row, error: null };
        },
      };
      return query;
    },
    storage: { from() { return { async upload(path: string, body: Blob) {
      events.push({ operation: "upload", value: { path, body: await body.text() } });
      return { error: failure === "upload" ? { message: "offline" } : null };
    } }; } },
  };
  return { client: client as unknown as SupabaseClient<Database>, events, row: () => row };
}

test("publishes only after Markdown upload, without writing the generated path", async () => {
  const fake = fakeSupabase();
  const result = await persistContent(fake.client, parseContentForm(form({ published: "on" })));
  assert.equal(result.error, undefined);
  assert.deepEqual(fake.events.map((event) => event.operation), ["read", "insert", "upload", "update"]);
  assert.equal(fake.events[1].value?.published, false);
  assert.equal("md_path" in fake.events[1].value!, false);
  assert.equal(fake.row()?.published, true);
  assert.ok(fake.row()?.md_uploaded_at);
  assert.ok(fake.row()?.published_at);
});

test("upload failures leave a draft and never run the publish update", async () => {
  const fake = fakeSupabase({ previous: { id, published: true, published_at: "2026-01-01T00:00:00Z" }, failure: "upload" });
  const result = await persistContent(fake.client, parseContentForm(form({ published: "on" })));
  assert.match(result.error!, /upload failed/);
  assert.equal(fake.row()?.published, false);
  assert.deepEqual(fake.events.map((event) => event.operation), ["read", "update", "upload"]);
});

test("final save failures are reported as drafts, not published successes", async () => {
  const fake = fakeSupabase({ failure: "finish" });
  const result = await persistContent(fake.client, parseContentForm(form({ published: "on" })));
  assert.match(result.error!, /remains a draft/);
  assert.equal(fake.row()?.published, false);
});

test("retries update the same ID and preserve the original publication date", async () => {
  const date = "2026-01-01T00:00:00Z";
  const fake = fakeSupabase({ previous: { id, published: false, published_at: date } });
  await persistContent(fake.client, parseContentForm(form({ published: "on" })));
  assert.equal(fake.events[1].operation, "update");
  assert.equal(fake.row()?.published_at, date);
});

test("unpublishing keeps the original date and hides the entry", async () => {
  const date = "2026-01-01T00:00:00Z";
  const fake = fakeSupabase({ previous: { id, published: true, published_at: date } });
  await persistContent(fake.client, parseContentForm(form()));
  assert.equal(fake.row()?.published, false);
  assert.equal(fake.row()?.published_at, date);
});

test("duplicate slugs do not upload or publish a file", async () => {
  const fake = fakeSupabase({ failure: "draft" });
  const result = await persistContent(fake.client, parseContentForm(form({ published: "on" })));
  assert.match(result.error!, /slug is already in use/);
  assert.equal(fake.events.some((event) => event.operation === "upload"), false);
});
