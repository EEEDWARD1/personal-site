import Link from "next/link";
import Image from "next/image";
import Card from "@/components/ui/card";
import ScrollGlowLink from "@/components/ui/scroll-glow-link";
import SectionHeader from "@/components/ui/section-header";
import BlogPostCard from "@/components/public/BlogPostCard";
import FreelanceCard from "@/components/public/FreelanceCard";
import ProjectCard from "@/components/public/ProjectCard";
import StatusMessage from "@/components/public/StatusMessage";
import { publicApi } from "@/lib/api";

const skills = [
  "Java",
  "Spring Boot",
  "Next.js",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "Python",
  "Haskell",
];

export default async function Home() {
  const [projectsResult, postsResult, freelanceResult] = await Promise.allSettled([
    publicApi.homepageProjects(),
    publicApi.homepageBlog(),
    publicApi.freelance(),
  ]);

  const projects =
    projectsResult.status === "fulfilled" ? projectsResult.value : [];
  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const freelance =
    freelanceResult.status === "fulfilled" ? freelanceResult.value : [];

  return (
    <main className="flex flex-col gap-10 pb-8">
      <section className="grid gap-6 py-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold tracking-normal text-teal-800 sm:text-base">
            London, UK
          </p>
          <h1 className="mt-4 text-4xl font-bold sm:text-6xl">
            Eduard Teodor
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-700">
            Recent Computer Science graduate and software developer building
            full-stack systems with Spring Boot, Next.js, PostgreSQL, Docker,
            and a healthy interest in self-hosting.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/freelance"
              className="button button-navy px-5 py-3 text-base ring-1 ring-slate-950/10"
            >
              Looking to work together?
            </Link>
            <Link href="/projects" className="button">
              View Projects
            </Link>
            <Link href="/blog" className="button">
              Read Blog
            </Link>
            <a
              href="/Eduard%27s%20CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              View CV
            </a>
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          <Image
            src="/myself.png"
            alt="Eduard Teodor"
            width={640}
            height={480}
            className="aspect-[4/3] w-full object-cover"
          />
        </Card>
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader title="Featured Projects">
            <p>Selected builds from the live project API.</p>
          </SectionHeader>
          <Link href="/projects" className="text-sm font-semibold text-teal-700">
            All projects
          </Link>
        </div>
        {projects.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <StatusMessage
            title="Projects are unavailable"
            message="The project API did not return data. Please try again shortly."
          />
        )}
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader title="Latest Writing">
            <p>Starred posts first, followed by recent notes.</p>
          </SectionHeader>
          <Link href="/blog" className="text-sm font-semibold text-teal-700">
            All posts
          </Link>
        </div>
        {posts.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <StatusMessage
            title="Blog posts are unavailable"
            message="The blog API did not return data. Please try again shortly."
          />
        )}
      </section>

      <section className="grid gap-4">
        <SectionHeader title="Freelance Work">
          <p className="mt-2">
            Client projects and hire-me signals pulled from the freelance API.
          </p>
        </SectionHeader>
        {freelance.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {freelance.slice(0, 2).map((work) => (
              <FreelanceCard key={work.id} work={work} />
            ))}
          </div>
        ) : (
          <Card>
            <h3 className="text-xl">Available for selected freelance work</h3>
            <p className="mt-3">
              I can help with fast, maintainable websites and practical full-stack
              tooling. The live showcase is empty or unavailable right now.
            </p>
            <ScrollGlowLink
              href="/contact"
              className="button cta-focus-glow mt-5 inline-block"
            >
              Start a conversation
            </ScrollGlowLink>
          </Card>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_1fr]">
        <Card>
          <h2 className="text-2xl">Tech Stack</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-2xl">Contact</h2>
          <p className="mt-3">
            Based in London and open to software roles, project collaboration,
            and freelance enquiries.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
            <a href="https://github.com/EEEDWARD1" className="text-teal-700">
              GitHub
            </a>
            <a href="https://www.linkedin.com" className="text-teal-700">
              LinkedIn
            </a>
            <a href="mailto:hello@eduardteodor.co.uk" className="text-teal-700">
              Email
            </a>
          </div>
        </Card>
      </section>
    </main>
  );
}
