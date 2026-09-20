"use client";

import { CONSENT_SETTINGS_EVENT } from "@/lib/cookie-consent";

export default function CookieSettingsButton() {
  return <button type="button" className="cursor-pointer underline underline-offset-3" onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))}>Cookie settings</button>;
}
