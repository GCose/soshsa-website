import Layout from "@/components/website/Layout";
import CTASection from "@/components/website/home/CTASection";
import HeroSection from "@/components/website/home/HeroSection";
import AboutSection from "@/components/website/home/AboutSection";
import EventsSection from "@/components/website/home/EventsSection";
import MagazineSection from "@/components/website/home/MagazineSection";

const HomePage = () => (
  <Layout
    ogImage="/images/logo.jpeg"
    title="SoSHSA |  School of Social Science and Humanities Students' Association"
    keywords="SOSHSA, soshsa, SOSHSA UTG, SoSHSA, SoSHSA UTG, UTG SoSHSA, Soshsa, SoSHSA The Gambia, The Gambia SoSHSA"
    description="Official website of the Social Sciences and Humanities Students' Association at the University of The Gambia."
  >
    <HeroSection />
    <AboutSection />
    <MagazineSection />
    <EventsSection />
    <CTASection />
  </Layout>
);

export default HomePage;
