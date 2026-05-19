import Link from "next/link";
import FreelanceCard from "@/components/public/FreelanceCard";
import Card from "@/components/ui/card";
import StatusMessage from "@/components/public/StatusMessage";
import { publicApi } from "@/lib/api";

export default async function FreelancePage() {
  const result = await publicApi.freelance().then(
    (entries) => ({ entries, error: false }),
    () => ({ entries: [], error: true }),
  );

  if (result.error) {
    return (
      <StatusMessage
        title="Freelance work unavailable"
        message="The freelance API could not be reached. Please try again shortly."
      />
    );
  }

  return (
    <main className="grid gap-5">
      <header>
        <h1 className="text-4xl">Freelance</h1>
        <p className="mt-3 max-w-2xl">
          Websites and full-stack tools for clients who need clear, reliable
          software without ceremony.
        </p>
      </header>
      <Card>
        <h2 className="text-2xl">Hire me</h2>
        <p className="mt-3">
          I work best on small business websites, portfolio systems, backend
          APIs, dashboards, and deployment or self-hosting workflows.
        </p>
        <Link href="/contact" className="button mt-5 inline-block">
          Get in touch
        </Link>
      </Card>
      {result.entries.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {result.entries.map((work) => (
            <FreelanceCard key={work.id} work={work} />
          ))}
        </div>
      ) : (
        <StatusMessage title="No showcase entries yet" message="Published freelance work will appear here." />
      )}
    </main>
  );
}
