"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
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
      className="rounded-lg border border-slate-200 bg-white/95 px-4 py-4 shadow-sm shadow-slate-200/80 backdrop-blur sm:flex sm:items-center sm:justify-between"
    >
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-950 transition-colors hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500"
          onClick={() => setIsOpen(false)}
        >
          Eduard Teodor
        </Link>
        <div className="sm:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center p-0"
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className="sr-only">
              {isOpen ? "Close navigation menu" : "Open navigation menu"}
            </span>
            <span className="flex h-4 w-5 flex-col justify-between" aria-hidden="true">
              <span
                className={`h-0.5 rounded-full bg-slate-900 transition duration-200 ${
                  isOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 rounded-full bg-slate-900 transition duration-200 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 rounded-full bg-slate-900 transition duration-200 ${
                  isOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      <ul
        id="mobile-navigation"
        className={`grid gap-1 overflow-hidden text-sm font-semibold text-slate-600 transition-all duration-200 ease-out sm:mt-0 sm:flex sm:max-h-none sm:translate-y-0 sm:flex-wrap sm:items-center sm:justify-end sm:gap-3 sm:overflow-visible sm:opacity-100 sm:visible ${
          isOpen
            ? "visible mt-4 max-h-80 translate-y-0 opacity-100"
            : "invisible mt-0 max-h-0 -translate-y-2 opacity-0 pointer-events-none sm:pointer-events-auto"
        }`}
      >
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="block rounded-md px-2 py-2 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/admin/login"
            className="block rounded-md px-2 py-2 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            onClick={() => setIsOpen(false)}
          >
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
}
