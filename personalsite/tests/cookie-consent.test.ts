import assert from "node:assert/strict";
import { test } from "node:test";
import { parseConsent, serializeConsent } from "../lib/cookie-consent";

test("missing, corrupt and unexpected consent never enables analytics", () => {
  for (const raw of [null, "", "not-json", "null", "true", '{}', '{"version":1,"analytics":"yes","expiresAt":9999999999999}', '{"version":2,"analytics":"granted","expiresAt":9999999999999}']) {
    assert.equal(parseConsent(raw), null);
  }
});

test("acceptance and rejection are preserved until the 180-day expiry", () => {
  const now = 1000;
  const duration = 180 * 24 * 60 * 60 * 1000;
  for (const value of ["granted", "denied"] as const) {
    const raw = serializeConsent(value, now);
    assert.equal(parseConsent(raw, now + duration - 1), value);
    assert.equal(parseConsent(raw, now + duration), null);
  }
});
