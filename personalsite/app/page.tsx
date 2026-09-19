import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Banner from "../components/Banner";
import Projects from "../components/Projects";
import Thoughts from "../components/Thoughts";
import ArrowIcon from "@/components/ArrowIcon";

export default function Home() {
  return (
    <>
    <Navigation />
    <main className="space-y-12 py-10 sm:py-12">
      <Banner />
      <div className="grid grid-cols-1 gap-5">
        <section id="Under Construction" className="scroll-mt-8 border-l-8 border-[#4E4B5C] bg-[#FB5607] p-6 text-white sm:p-8" aria-labelledby="Under Construction">
                  {/* Bootstrap Icons (MIT); see THIRD_PARTY_NOTICES.md. */}
                  <div className="flex items-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
                      <path d="m9.97 4.88.953 3.811C10.159 8.878 9.14 9 8 9s-2.158-.122-2.923-.309L6.03 4.88C6.635 4.957 7.3 5 8 5s1.365-.043 1.97-.12m-.245-.978L8.97.88C8.718-.13 7.282-.13 7.03.88L6.275 3.9C6.8 3.965 7.382 4 8 4s1.2-.036 1.725-.098m4.396 8.613a.5.5 0 0 1 .037.96l-6 2a.5.5 0 0 1-.316 0l-6-2a.5.5 0 0 1 .037-.96l2.391-.598.565-2.257c.862.212 1.964.339 3.165.339s2.303-.127 3.165-.339l.565 2.257z"/>
                    </svg>
                    <h2 id="project-heading" className="text-3xl! leading-tight tracking-tight sm:text-4xl!">Under Construction!</h2>
                  </div>
                  <p className="mt-4 text-base!">I've decided to overhaul the site, so please bear with me while I update certain features.</p>
                </section>
        <div className="grid grid-cols-1 gap-5 opacity-60">
          <Projects />
          <Thoughts />
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
