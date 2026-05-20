import Hero from "./_components/Hero";
import Features from "./_components/Features";
import HowItWorks from "./_components/HowItWorks";
import Testimonials from "./_components/Testimonials";
import dynamic from "next/dynamic";
import CTABanner from "./_components/CTABanner";
import Footer from "./_components/Footer";

const PopularCityList = dynamic(
  () => import("./_components/PopularCityList").then((mod) => ({ default: mod.PopularCityList })),
  { loading: () => <div className="w-full h-96" /> }
);

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
