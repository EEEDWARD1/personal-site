"use client";

import Link from "next/link";

export default function ContentError({ reset }: { reset: () => void }) {
  return <main className="space-y-5 py-10"><h1>Temporarily unavailable</h1><p>This entry could not be loaded. Please try again.</p><button className="block-button" onClick={reset}>Try again</button><p><Link href="/">Back to home</Link></p></main>;
}
