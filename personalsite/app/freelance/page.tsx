import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export const metadata: Metadata = {
  title: "Freelance | Eduard Teodor",
  description: "Discuss a freelance programming project with Eduard Teodor.",
};

export default function FreelancePage() {
  return (
    <>
      <Navigation />
      <main className="space-y-12 pb-12 pt-4 [&_p]:font-normal! [&_p]:leading-relaxed [&_h2]:font-bold! [&_h3]:font-semibold!">

        <section aria-labelledby="freelance-heading">
          <div aria-hidden="true" className="mb-8 grid h-2 grid-cols-5">
          </div>
          <span className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
            <span aria-hidden="true" className="size-2 bg-[#FB5607]" /> Independent developer
          </span>
          <h1 id="freelance-heading" className="max-w-lg text-4xl! leading-[1.08] tracking-tight sm:text-5xl!">
            Small ideas.<br />
            <span className="text-[#3A86FF]">Real possibilities.</span>
          </h1>
          <p className="mt-6 max-w-md text-base! text-foreground/75 sm:text-lg!">
            I&apos;m Ed. I turn ideas into useful websites and software, with your
            goals at the heart of every decision.
          </p>
          <a href="#start-project" className="mt-8 inline-flex min-h-12 items-center gap-6 border-2 border-[#4E4B5C] bg-[#FFBE0B] px-5 py-3 font-medium text-[#0a0a0a] shadow-[4px_4px_0_#4E4B5C] hover:bg-[#FB5607] hover:text-[#0a0a0a] hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4">
            Let&apos;s talk about your idea <span aria-hidden="true">↗</span>
          </a>
          <div className="mt-10 flex flex-wrap gap-2" aria-label="Technologies I work with">
            {["Next.js", "ASP.NET Core", "Python"].map((technology) => (
              <span key={technology} className="border border-[#4E4B5C]/40 px-3 py-1.5 font-mono text-xs text-foreground/70 dark:border-white/25">{technology}</span>
            ))}
          </div>
        </section>

        <section aria-labelledby="services-heading">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="services-heading" className="tracking-tight">What can we build?</h2>
            <span aria-hidden="true" className="font-mono text-xs text-foreground/50">01 / IDEAS</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { symbol: "</>", title: "Websites", accent: "bg-[#3A86FF] text-[#0a0a0a]", description: "A clear, responsive home for your business, portfolio, or next idea." },
              { symbol: "{ }", title: "Web apps", accent: "bg-[#802392] text-white", description: "Useful tools built around the people who will actually use them." },
              { symbol: ">_", title: "Automation", accent: "bg-[#FB5607] text-[#0a0a0a]", description: "Small scripts and integrations to take repetitive work off your hands." },
            ].map((service) => (
              <article key={service.title} className="border border-[#4E4B5C]/40 p-5 dark:border-white/25">
                <span aria-hidden="true" className={`mb-6 flex size-11 items-center justify-center font-mono ${service.accent}`}>{service.symbol}</span>
                <h3>{service.title}</h3>
                <p className="mt-3 text-sm! text-foreground/70">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="process-heading">
          <div className="mb-6 flex items-baseline justify-between gap-4">
            <h2 id="process-heading" className="tracking-tight">A conversation first.</h2>
            <span aria-hidden="true" className="font-mono text-xs text-foreground/50">02 / PROCESS</span>
          </div>
          <ol className="divide-y divide-[#4E4B5C]/40 border-y border-[#4E4B5C]/40 dark:divide-white/25 dark:border-white/25">
            {[
              ["Tell me the idea", "What are you trying to solve, and who is it for? We start there."],
              ["Make a plan", "We discuss scope, budget, and timing before committing to the work."],
              ["Build it together", "Keep the feedback flowing as the idea takes shape."],
            ].map(([title, description], index) => (
              <li key={title} className="flex gap-5 py-6">
                <span className="flex size-10 shrink-0 items-center justify-center bg-[#4E4B5C] font-mono text-sm text-white">0{index + 1}</span>
                <div><h3>{title}</h3><p className="mt-1 text-sm! text-foreground/70">{description}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section id="start-project" className="scroll-mt-8 border-l-8 border-[#802392] bg-[#FFBE0B] p-6 text-[#0a0a0a] sm:p-8" aria-labelledby="project-heading">
          <span className="font-mono text-xs tracking-widest">03 / YOUR NEXT IDEA</span>
          <h2 id="project-heading" className="mt-5 text-3xl! leading-tight tracking-tight sm:text-4xl!">Have something in mind?</h2>
          <p className="mt-4 max-w-lg text-base!">A rough idea is a good place to start. Send me a little about your project, timeline, and budget, and we can see if we&apos;re a good fit.</p>
          <a href="mailto:ed@eduardteodor.co.uk?subject=Freelance%20project" className="mt-6 inline-flex min-h-12 items-center gap-6 border-2 border-[#4E4B5C] bg-[#4E4B5C] px-6 py-3 text-white hover:bg-[#802392] hover:text-white hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4">
            Say hello <span aria-hidden="true">↗</span>
          </a>
          <p className="mt-4 text-sm!">I take on freelance projects from time to time.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
