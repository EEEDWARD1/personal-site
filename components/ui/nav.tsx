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
    <nav className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white/90 px-4 py-4 shadow-lg shadow-slate-200/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
        Eduard Teodor
      </Link>
      <ul className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600 sm:gap-5">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="transition-colors duration-200 hover:text-teal-700"
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/admin/login"
            className="transition-colors duration-200 hover:text-teal-700"
          >
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}
