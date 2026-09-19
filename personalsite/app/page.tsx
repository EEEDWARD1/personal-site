import Image from "next/image";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";
import Banner from "../components/Banner";
import Projects from "../components/Projects";
import Thoughts from "../components/Thoughts";

export default function Home() {
  return (
    <>
    <Navigation />
    <Banner />
    <Projects />
    <Thoughts />
    <Footer />
    </>
  );
}
