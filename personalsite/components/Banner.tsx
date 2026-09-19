import Link from 'next/link';

export default function Banner() {
  return (
    <section className="space-y-5" aria-labelledby="intro-heading">
      <h1 id="intro-heading"><span className="text-blue">Hi</span>, I&apos;m <Link href="/" className="font-extrabold text-inherit hover:text-inherit">Ed.</Link></h1>
      <p>I live in <Link href="https://www.google.com/search?q=london">London, United Kingdom</Link> and I am a recent First Class Computer Science graduate from <Link href="https://www.citystgeorges.ac.uk/">City St Georges, University of London</Link>.</p>
      <p>I love programming and building thoughtful solutions that put clients first. I also take on <Link href="/freelance">freelance projects</Link> from time to time.</p>
      <p>Currently I have been loving <Link href="https://dotnet.microsoft.com/en-us/apps/aspnet">asp.Net Core</Link>, <Link href="https://nextjs.org/">Next.js</Link> and <Link href="https://www.python.org/">Python</Link>.</p>
      {/* Bootstrap Icons (MIT); see THIRD_PARTY_NOTICES.md. */}
      <div className="flex items-center gap-3 border-y border-line py-4 [&_a]:border [&_a]:border-line">
        <Link href="" aria-label="GitHub" title="GitHub" className="inline-flex size-11 items-center justify-center text-foreground hover:text-foreground hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>
        </Link>
        <Link href="" aria-label="LinkedIn" title="LinkedIn" className="inline-flex size-11 items-center justify-center text-foreground hover:text-foreground hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
