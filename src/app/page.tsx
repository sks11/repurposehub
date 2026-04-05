import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TryIt from "@/components/TryIt";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import PlatformShowcase from "@/components/PlatformShowcase";
import ChromeExtension from "@/components/ChromeExtension";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TryIt />
        <SocialProof />
        <HowItWorks />
        <PlatformShowcase />
        <ChromeExtension />
        <Pricing />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
