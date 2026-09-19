import Link from "next/link";

export default function Navigation() {
  return (
    <div className="border-b-16 border-transparent">
      <h2>
        <Link href="/" className="text-inherit hover:text-inherit">
          Eduard Teodor
        </Link>
      </h2>
      <div aria-hidden="true" className="mt-3 grid h-2 grid-cols-5">
        <span className="bg-[#FFBE0B]" />
        <span className="bg-[#FB5607]" />
        <span className="bg-[#4E4B5C]" />
        <span className="bg-[#802392]" />
        <span className="bg-[#3A86FF]" />
      </div>
    </div>
  );
}
