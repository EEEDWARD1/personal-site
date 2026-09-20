"use client";

import Link from "next/link";

export default function ManageError({ reset }: { reset: () => void }) {
  return <div className="space-y-5"><h1>Unable to load the editor</h1><p>Check your connection and try again.</p><button className="block-button" onClick={reset}>Try again</button><p><Link href="/manage">Back to manage</Link></p></div>;
}
