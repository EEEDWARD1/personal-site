import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Banner from "../components/Banner";
import Projects from "../components/Projects";
import Thoughts from "../components/Thoughts";

// Cached and revalidated in the background at most every 60s, instead of
// hitting Supabase on every request. Detail pages stay force-dynamic so
// publish/unpublish is reflected there immediately.
export const revalidate = 60;

export default function Home() {
  return (
    <>
    <Navigation />
    <main className="space-y-12 py-10 sm:py-12">
      <Banner />
      <div className="grid grid-cols-1 gap-5">
        <Projects />
        <Thoughts />
      </div>
    </main>
    <Footer />
    </>
  );
}
