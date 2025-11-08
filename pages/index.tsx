
import Layout from "@/components/website/Layout"
import HeroSection from "@/components/website/home/HeroSection" 
// import CitationCTA from "@/components/home/CitationCTA"
// import ContactForm from "@/components/home/ContactForm"
// import AboutPreview from "@/components/home/AboutPreview"
// import MagazineShowcase from "@/components/home/MagazineShowcase"
// import InductionPreview from "@/components/home/InductionPreview"

const HomePage = () => (
  <Layout 
    title="SoSHSA |  School of Social Science and Humanities Students' Association"
    description="Official website of the Social Sciences and Humanities Students' Association at the University of The Gambia."
  >
    <HeroSection />
    {/* <AboutPreview />
    <MagazineShowcase />
    <InductionPreview />
    <CitationCTA />
    <ContactForm /> */}
  </Layout>
)

export default HomePage
