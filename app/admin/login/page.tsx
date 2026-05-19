"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/card";
import { ApiError, login, setAuthToken, verifyMfaLogin } from "@/lib/api";

type LoginView = "credentials" | "mfa";

export default function AdminLoginPage() {
  const router = useRouter();
  const mfaInputRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<LoginView>("credentials");
  const [preAuthToken, setPreAuthToken] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (view === "mfa") {
      mfaInputRef.current?.focus();
    }
  }, [view]);

  async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    try {
      const response = await login(
        String(formData.get("username")),
        String(formData.get("password")),
      );

      if ("token" in response && response.token) {
        setAuthToken(response.token);
        router.replace("/admin/dashboard");
        return;
      }

      if (response.status === "MFA_REQUIRED") {
        window.sessionStorage.setItem("preAuthToken", response.preAuthToken);
        setPreAuthToken(response.preAuthToken);
        setMfaCode("");
        setView("mfa");
        return;
      }

      setError("Login failed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function submitMfaCode(code: string) {
    if (loading) return;

    const tokenForMfa =
      preAuthToken || window.sessionStorage.getItem("preAuthToken");
    if (!tokenForMfa) {
      setError("Session expired, please log in again");
      setView("credentials");
      setMfaCode("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await verifyMfaLogin(tokenForMfa, code);
      setAuthToken(response.token);
      setPreAuthToken("");
      router.replace("/admin/dashboard");
    } catch (err) {
      setMfaCode("");
      if (err instanceof ApiError && err.status === 401) {
        setError("Session expired, please log in again");
        setPreAuthToken("");
        setView("credentials");
      } else {
        setError("Invalid code, please try again");
      }
    } finally {
      window.sessionStorage.removeItem("preAuthToken");
      setLoading(false);
    }
  }

  function handleMfaChange(value: string) {
    const code = value.replace(/\D/g, "").slice(0, 6);
    setMfaCode(code);

    if (code.length === 6) {
      void submitMfaCode(code);
    }
  }

  function handleBackToCredentials() {
    window.sessionStorage.removeItem("preAuthToken");
    setPreAuthToken("");
    setView("credentials");
    setMfaCode("");
    setError("");
  }

  return (
    <main className="mx-auto w-full max-w-md">
      <Card>
        {view === "credentials" ? (
          <>
            <h1 className="text-3xl">Admin login</h1>
            <p className="mt-3">Sign in to manage portfolio content.</p>
            <form onSubmit={handleCredentialsSubmit} className="mt-6 grid gap-4">
              <label>
                Username
                <input name="username" autoComplete="username" required />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
            </form>
          </>
        ) : (
          <section className="grid gap-5">
            <button
              type="button"
              onClick={handleBackToCredentials}
              className="w-fit border-0 bg-transparent px-0 py-0 shadow-none hover:bg-transparent"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl">Two-Factor Authentication</h1>
              <p className="mt-3">
                Open Google Authenticator and enter your 6-digit code
              </p>
            </div>
            <label className="text-center">
              Authentication code
              <input
                ref={mfaInputRef}
                value={mfaCode}
                onChange={(event) => handleMfaChange(event.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                autoComplete="one-time-code"
                className="text-center text-3xl font-bold tracking-[0.35em]"
                disabled={loading}
              />
            </label>
            {loading ? (
              <p className="text-center text-sm font-semibold text-teal-700">
                Verifying...
              </p>
            ) : null}
            {error ? <p className="text-center text-sm text-red-700">{error}</p> : null}
          </section>
        )}
      </Card>
    </main>
  );
}
