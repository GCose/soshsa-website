import Layout from "@/components/website/Layout";
import OurStory from "@/components/website/about/OurStory";
import AboutHero from "@/components/website/about/AboutHero";
import Executives from "@/components/website/about/Executives";
import MissionVision from "@/components/website/about/MissionVision";
import CommunityImpact from "@/components/website/about/CommunityImpact";

const AboutPage = () => (
  <Layout
    title="SoSHSA | About Us"
    ogImage="/images/logo.jpeg"
    keywords="About SOSHSA, about soshsa, about SOSHSA UTG, SoSHSA, SoSHSA UTG, UTG SoSHSA, Soshsa, SoSHSA The Gambia, The Gambia SoSHSA"
    description="Learn about the Social Sciences and Humanities Students' Association - our mission, vision, leadership, and impact at the University of The Gambia."
  >
    <AboutHero />
    <OurStory />
    <MissionVision />
    <Executives />
    <CommunityImpact />
  </Layout>
);

export default AboutPage;
