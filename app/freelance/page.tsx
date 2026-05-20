import FreelanceCard from "@/components/public/FreelanceCard";
import Card from "@/components/ui/card";
import ScrollGlowLink from "@/components/ui/scroll-glow-link";
import SectionHeader from "@/components/ui/section-header";
import StatusMessage from "@/components/public/StatusMessage";
import { publicApi } from "@/lib/api";

const serviceAreas = [
  {
    title: "Small business websites",
    description: "Fast, maintainable pages that make the important information easy to find.",
  },
  {
    title: "Portfolio systems",
    description: "Simple content structures for projects, writing, and case studies.",
  },
  {
    title: "Backend APIs",
    description: "Practical endpoints and data flows built with reliability in mind.",
  },
  {
    title: "Dashboards",
    description: "Focused internal tools for viewing, editing, and managing useful data.",
  },
  {
    title: "Deployment workflows",
    description: "Clear release paths, hosting setup, and basic operational documentation.",
  },
  {
    title: "Self-hosting workflows",
    description: "Lightweight infrastructure setup for projects that need more control.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Scope",
    description: "Clarify the goal, required pages or features, constraints, and what success looks like.",
  },
  {
    step: "02",
    title: "Build",
    description: "Work in small visible increments, keeping the implementation simple and maintainable.",
  },
  {
    step: "03",
    title: "Launch",
    description: "Test the important paths, tidy the handoff, and make sure the site or tool is ready to use.",
  },
];

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full p-4">
      <h3 className="text-base">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </Card>
  );
}

function ProcessCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
        {step}
      </span>
      <h3 className="mt-3 text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-7">{description}</p>
    </li>
  );
}

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
    <main className="grid gap-10 pb-8">
      <header className="grid gap-6 rounded-xl border border-slate-200 bg-white px-5 py-7 shadow-sm shadow-slate-200/70 sm:px-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
            Available for selected freelance work
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl">Freelance</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Websites and full-stack tools for clients who need clear, reliable
            software without ceremony.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ScrollGlowLink
              href="/contact"
              className="button button-navy cta-focus-glow"
            >
              Get in touch
            </ScrollGlowLink>
            <a href="#recent-work" className="button">
              View recent work
            </a>
          </div>
        </div>
        <Card className="border-slate-300 bg-slate-50/80">
          <h2 className="text-2xl">Hire me</h2>
          <p className="mt-3">
            I work best on small business websites, portfolio systems, backend
            APIs, dashboards, and deployment or self-hosting workflows.
          </p>
        </Card>
      </header>

      <section className="grid gap-5" aria-labelledby="services-heading">
        <SectionHeader
          id="services-heading"
          eyebrow="Services"
          title="Practical help for small builds"
        >
          <p>
            I work best on small business websites, portfolio systems, backend
            APIs, dashboards, and deployment or self-hosting workflows.
          </p>
        </SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="grid gap-5" aria-labelledby="process-heading">
        <SectionHeader
          id="process-heading"
          eyebrow="Process"
          title="A simple way of working"
        >
          <p>
            Clear scope, steady communication, and enough structure to keep the
            project moving without turning it into a large agency process.
          </p>
        </SectionHeader>
        <ol className="grid gap-4 md:grid-cols-3">
          {processSteps.map((item) => (
            <ProcessCard key={item.step} {...item} />
          ))}
        </ol>
      </section>

      <section id="recent-work" className="grid gap-5 scroll-mt-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow="Showcase" title="Recent work preview">
            <p>Client projects and freelance examples published from the live API.</p>
          </SectionHeader>
          <ScrollGlowLink href="/contact" className="button cta-focus-glow">
            Start a conversation
          </ScrollGlowLink>
        </div>
        {result.entries.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {result.entries.map((work) => (
              <FreelanceCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <StatusMessage
            title="No showcase entries yet"
            message="Published freelance work will appear here."
          />
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm shadow-slate-300/70 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl text-white">Have a project in mind?</h2>
            <p className="mt-2 max-w-2xl text-slate-300">
              Websites and full-stack tools for clients who need clear,
              reliable software without ceremony.
            </p>
          </div>
          <ScrollGlowLink
            href="/contact"
            className="button cta-focus-glow shrink-0"
          >
            Get in touch
          </ScrollGlowLink>
        </div>
      </section>
    </main>
  );
}
