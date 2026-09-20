export const CONSENT_KEY = "site-cookie-consent-v1";
export const CONSENT_EVENT = "site-cookie-consent-change";
export const CONSENT_SETTINGS_EVENT = "site-cookie-settings";
export type Consent = "granted" | "denied";
const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;

export function parseConsent(raw: string | null, now = Date.now()): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw);
    if (value.version !== 1 || typeof value.expiresAt !== "number" || value.expiresAt <= now) return null;
    return value.analytics === "granted" || value.analytics === "denied" ? value.analytics : null;
  } catch { return null; }
}

export function serializeConsent(analytics: Consent, now = Date.now()) {
  return JSON.stringify({ version: 1, analytics, expiresAt: now + CONSENT_DURATION });
}
