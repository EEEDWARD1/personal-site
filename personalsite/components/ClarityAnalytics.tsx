"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Clarity from "@microsoft/clarity";
import { CONSENT_KEY, CONSENT_EVENT, CONSENT_SETTINGS_EVENT, parseConsent, serializeConsent, type Consent } from "@/lib/cookie-consent";

let initialized = false;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function readConsent() {
  try { return parseConsent(window.localStorage.getItem(CONSENT_KEY)); }
  catch { return null; }
}

function clearAnalyticsCookies() {
  const parts = window.location.hostname.split(".");
  for (const name of ["_clck", "_clsk"]) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    for (let index = 0; index < parts.length - 1; index++) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${parts.slice(index).join(".")}; SameSite=Lax`;
    }
  }
}

export default function ClarityAnalytics() {
  const storedConsent = useSyncExternalStore(subscribe, readConsent, () => null);
  const [temporaryConsent, setTemporaryConsent] = useState<Consent | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const consent = temporaryConsent ?? storedConsent;

  useEffect(() => {
    const openSettings = () => setSettingsOpen(true);
    window.addEventListener(CONSENT_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, openSettings);
  }, []);

  useEffect(() => {
    if (consent !== "granted") {
      if (initialized) {
        Clarity.consentV2({ analytics_Storage: "denied", ad_Storage: "denied" });
        clearAnalyticsCookies();
        // Unload the recorder entirely, including its event listeners.
        window.location.reload();
      }
      return;
    }
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();
    if (process.env.NODE_ENV !== "production" || !projectId || initialized) return;
    Clarity.init(projectId);
    Clarity.consentV2({ analytics_Storage: "granted", ad_Storage: "denied" });
    initialized = true;
  }, [consent]);

  function choose(value: Consent) {
    try {
      window.localStorage.setItem(CONSENT_KEY, serializeConsent(value));
      setTemporaryConsent(null);
    } catch {
      // When storage is unavailable, honour the choice for this page only.
      setTemporaryConsent(value);
    }
    if (value === "denied") clearAnalyticsCookies();
    setSettingsOpen(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  if (consent && !settingsOpen) return null;
  return <section aria-labelledby="cookie-heading" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[80vh] max-w-2xl overflow-y-auto border border-line bg-background p-5 shadow-lg sm:p-6">
    <h2 id="cookie-heading">Your cookie choices</h2>
    <p className="mt-2 text-sm!">With your permission, I use Microsoft Clarity to understand visits through heatmaps and session recordings. Analytics is optional. Essential storage keeps sign-in and your cookie choice working.</p>
    <Link href="/privacy" className="mt-3 inline-block text-sm underline">Privacy and cookie policy</Link>
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" className="border border-line px-4 py-2 font-semibold hover:bg-foreground/5" onClick={() => choose("denied")}>Reject analytics</button>
      <button type="button" className="border border-line px-4 py-2 font-semibold hover:bg-foreground/5" onClick={() => choose("granted")}>Accept analytics</button>
      {consent && <button type="button" className="px-3 py-2 underline" onClick={() => setSettingsOpen(false)}>Close</button>}
    </div>
  </section>;
}
