import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import PlatformShowcase from "@/components/PlatformShowcase";
import BrandVoice from "@/components/BrandVoice";
import BeforeAfter from "@/components/BeforeAfter";
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
        <SocialProof />
        <HowItWorks />
        <PlatformShowcase />
        <BrandVoice />
        <BeforeAfter />
        <ChromeExtension />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
