import Link from "next/link";
import ArrowIcon from "./ArrowIcon";

export default function Navigation() {
  return (
    <header>
      <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-between gap-4 py-2">
        <Link href="/" className="text-inherit hover:text-inherit">
          <span className="text-xl font-semibold tracking-tight">Eduard Teodor</span>
        </Link>
        <Link href="/freelance" className="inline-flex min-h-11 items-center text-foreground hover:text-foreground">Freelance <ArrowIcon className="ml-2 text-blue" /></Link>
      </nav>
      <div aria-hidden="true" className="mt-3 grid h-2 grid-cols-5">
        <span className="bg-[#FFBE0B]" />
        <span className="bg-[#FB5607]" />
        <span className="bg-[#4E4B5C]" />
        <span className="bg-[#802392]" />
        <span className="bg-[#3A86FF]" />
      </div>
    </header>
  );
}
