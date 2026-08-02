import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Adventure from "@/components/Adventure";
import Packages from "@/components/Packages";
import Gallery from "@/components/Gallery";

import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full bg-stone-50 overflow-hidden">
        <Hero />
        <Destinations />
        <Adventure />
        <Packages />
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
