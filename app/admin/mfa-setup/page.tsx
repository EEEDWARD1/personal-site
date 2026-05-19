"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import Card from "@/components/ui/card";
import {
  ApiError,
  clearAuthToken,
  setupMfa,
  verifyMfaSetup,
} from "@/lib/api";

type SetupState = "initial" | "qr" | "success";

export default function MfaSetupPage() {
  return (
    <AdminGuard>
      {(token) => <MfaSetup token={token} />}
    </AdminGuard>
  );
}

function MfaSetup({ token }: { token: string }) {
  const router = useRouter();
  const [state, setState] = useState<SetupState>("initial");
  const [secret, setSecret] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleExpiredSession() {
    clearAuthToken();
    setError("Session expired, please log in again");
    router.replace("/admin/login");
  }

  async function generateQrCode() {
    setLoading(true);
    setError("");
    setCopied(false);

    try {
      const response = await setupMfa(token);
      setSecret(response.secret);
      setQrCode(response.qrCode);
      setState("qr");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        handleExpiredSession();
      } else {
        setError("Failed to generate MFA setup");
      }
    } finally {
      setLoading(false);
    }
  }

  async function activateMfa() {
    if (code.length !== 6 || loading) return;

    setLoading(true);
    setError("");

    try {
      await verifyMfaSetup(token, code);
      setSecret("");
      setQrCode("");
      setCode("");
      setState("success");
    } catch (err) {
      setCode("");
      if (err instanceof ApiError && err.status === 401) {
        handleExpiredSession();
      } else {
        setError("Invalid code, please try again");
      }
    } finally {
      setLoading(false);
    }
  }

  async function copySecret() {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
  }

  return (
    <section className="mx-auto w-full max-w-2xl">
      <Card>
        {state === "initial" ? (
          <div className="grid gap-5">
            <div>
              <h2 className="text-3xl">Set Up Two-Factor Authentication</h2>
              <p className="mt-3">
                Secure your admin account with Google Authenticator.
              </p>
            </div>
            <button type="button" onClick={generateQrCode} disabled={loading}>
              {loading ? "Generating..." : "Generate QR Code"}
            </button>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </div>
        ) : null}

        {state === "qr" ? (
          <div className="grid gap-5">
            <div>
              <h2 className="text-3xl">Scan QR Code</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700">
                <li>Install Google Authenticator on your phone if you haven&apos;t already</li>
                <li>Scan the QR code below with Google Authenticator</li>
                <li>Enter the 6-digit code shown in the app to confirm</li>
              </ol>
            </div>

            <div className="flex justify-center rounded-md border border-slate-200 bg-white p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="Scan this QR code with Google Authenticator"
                width={200}
                height={200}
              />
            </div>

            <div className="grid gap-2">
              <p className="text-sm font-semibold text-slate-700">Secret key</p>
              <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <code className="break-all font-mono text-sm text-slate-900">
                  {secret}
                </code>
                <button type="button" onClick={copySecret} className="shrink-0">
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900">
              <p className="font-semibold text-amber-950">
                ⚠️ Save this secret key in your password manager.
              </p>
              <p className="mt-1 text-amber-900">
                If you lose access to your phone, this is the only way to
                recover your account.
              </p>
            </div>

            <label>
              6-digit code
              <input
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                className="text-center text-2xl font-bold tracking-[0.28em]"
              />
            </label>

            <button type="button" onClick={activateMfa} disabled={loading || code.length !== 6}>
              {loading ? "Activating..." : "Activate MFA"}
            </button>
            {error ? <p className="text-sm text-red-700">{error}</p> : null}
          </div>
        ) : null}

        {state === "success" ? (
          <div className="grid gap-5">
            <div className="rounded-md border border-teal-200 bg-teal-50 p-4">
              <h2 className="text-2xl text-teal-900">
                ✓ Two-factor authentication has been enabled
              </h2>
              <p className="mt-3 text-teal-800">
                From now on, you will be asked for a code from Google
                Authenticator each time you log in.
              </p>
            </div>
            <Link href="/admin/dashboard" className="button w-fit">
              Back to dashboard
            </Link>
          </div>
        ) : null}
      </Card>
    </section>
  );
}
