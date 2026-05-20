import Link from "next/link";

export default function Nav() {
  const links = [
    ["Home", "/"],
    ["Blog", "/blog"],
    ["Projects", "/projects"],
    ["Freelance", "/freelance"],
    ["Contact", "/contact"],
  ];

  return (
    <nav
      aria-label="Main navigation"
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-200/80 backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-slate-950 transition-colors hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
      >
        Eduard Teodor
      </Link>
      <ul className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 sm:gap-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="rounded-md px-2 py-2 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/admin/login"
            className="rounded-md px-2 py-2 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
          >
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}
