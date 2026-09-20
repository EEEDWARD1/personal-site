"use client";

import { useActionState } from "react";
import { signIn, signOut } from "@/app/manage/actions";

export function SignInForm() {
  const [state, action, pending] = useActionState(signIn, {});
  return <form action={action} className="mt-6 max-w-md space-y-5">
    <label className="block">Email<input type="email" name="email" autoComplete="username" required className="editor-input" /></label>
    <label className="block">Password<input type="password" name="password" autoComplete="current-password" required className="editor-input" /></label>
    {state.error && <p role="alert">{state.error}</p>}
    <button disabled={pending} className="block-button">{pending ? "Signing in…" : "Sign in"}</button>
  </form>;
}

export function SignOutForm() {
  const [state, action, pending] = useActionState(signOut, {});
  return <form action={action}>
    <button disabled={pending} className="block-button">{pending ? "Signing out…" : "Sign out"}</button>
    {state.error && <p role="alert">{state.error}</p>}
  </form>;
}
