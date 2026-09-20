import assert from "node:assert/strict";
import { test } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/content-types";
import { removeContent } from "../lib/delete-content";

const id = "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee";
function fakeClient(failure = "", missing = false) {
  const calls: string[] = [];
  let published = true;
  const client = {
    from(kind: string) {
      assert.equal(kind, "thoughts");
      let deleting = false;
      const query = {
        select() {
          if (deleting) {
            calls.push("delete-row");
            return Promise.resolve({ error: failure === "row" ? {} : null });
          }
          return query;
        },
        eq(column: string, value: string) { assert.equal(column, "id"); assert.equal(value, id); return query; },
        async maybeSingle() {
          calls.push("read");
          return { data: missing ? null : { id, md_path: `thoughts/${id}.md` }, error: failure === "read" ? {} : null };
        },
        update(value: { published: boolean; md_uploaded_at: null }) {
          assert.equal(value.published, false);
          assert.equal(value.md_uploaded_at, null);
          return query;
        },
        async single() {
          calls.push("unpublish");
          if (failure !== "draft") published = false;
          return { error: failure === "draft" ? {} : null };
        },
        delete() { deleting = true; return query; },
      };
      return query;
    },
    storage: { from(bucket: string) {
      assert.equal(bucket, "content");
      return { async remove(paths: string[]) {
        assert.deepEqual(paths, [`thoughts/${id}.md`]);
        calls.push("delete-file");
        return { error: failure === "storage" ? {} : null };
      } };
    } },
  };
  return { client: client as unknown as SupabaseClient<Database>, calls, published: () => published };
}

test("deletion hides the entry and removes its file before its database row", async () => {
  const fake = fakeClient();
  const result = await removeContent(fake.client, "thoughts", id);
  assert.equal(result.error, undefined);
  assert.deepEqual(fake.calls, ["read", "unpublish", "delete-file", "delete-row"]);
});

test("failed reads or unpublishing do not delete anything", async () => {
  for (const failure of ["read", "draft"]) {
    const fake = fakeClient(failure);
    const result = await removeContent(fake.client, "thoughts", id);
    assert.ok(result.error);
    assert.equal(fake.calls.includes("delete-file"), false);
    assert.equal(fake.calls.includes("delete-row"), false);
    assert.equal(fake.published(), true);
  }
});

test("failed file removal leaves a recoverable draft row", async () => {
  const fake = fakeClient("storage");
  const result = await removeContent(fake.client, "thoughts", id);
  assert.match(result.error!, /file could not be deleted/);
  assert.equal(fake.published(), false);
  assert.equal(fake.calls.includes("delete-row"), false);
});

test("failed row deletion explains how to recover", async () => {
  const fake = fakeClient("row");
  const result = await removeContent(fake.client, "thoughts", id);
  assert.match(result.error!, /0004_storage_delete.sql/);
  assert.equal(fake.published(), false);
});

test("retrying an already deleted entry is harmless", async () => {
  const fake = fakeClient("", true);
  const result = await removeContent(fake.client, "thoughts", id);
  assert.equal(result.error, undefined);
  assert.deepEqual(fake.calls, ["read"]);
});
