import Layout from "@/components/website/Layout";
import HeroSection from "@/components/website/home/HeroSection";
import AboutSection from "@/components/website/home/AboutSection";
import EventsSection from "@/components/website/home/EventsSection";
import MagazineSection from "@/components/website/home/MagazineSection";
import ContactSection from "@/components/website/home/ContactSection";

const HomePage = () => (
  <Layout
    title="SoSHSA |  School of Social Science and Humanities Students' Association"
    description="Official website of the Social Sciences and Humanities Students' Association at the University of The Gambia."
  >
    <HeroSection />
    <AboutSection />
    <MagazineSection />
    <EventsSection />
    <ContactSection />
  </Layout>
);

export default HomePage;
