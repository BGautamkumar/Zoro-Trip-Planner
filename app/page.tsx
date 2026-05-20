import Hero from "./_components/Hero";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import { PopularCityList } from "./_components/PopularCityList";
import CTABanner from "./_components/CTABanner";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <PopularCityList />
      <CTABanner />
      <Footer />
    </main>
  );
}
