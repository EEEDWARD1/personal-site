import Link from "next/link";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="flex min-h-[50vh] flex-col items-start justify-center gap-4 py-12">
        <h1><span className="text-[#3A86FF]">404</span> — Page not found</h1>
        <p>The page you are looking for may have moved or does not exist.</p>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
          <span aria-hidden="true">←</span>
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
