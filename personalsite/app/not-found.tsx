import Link from "next/link";
import ArrowIcon from "../components/ArrowIcon";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="my-10 flex min-h-[50vh] flex-col items-start justify-center gap-6 border-l-4 border-purple bg-foreground/[0.03] px-5 py-12 sm:px-8">
        <h1><span className="text-[#3A86FF]">404</span> — Page not found</h1>
        <p>The page you are looking for may have moved or does not exist.</p>
        <Link href="/" className="block-button">
          <ArrowIcon direction="left" />
          Back to home
        </Link>
      </main>
      <Footer />
    </>
  );
}
