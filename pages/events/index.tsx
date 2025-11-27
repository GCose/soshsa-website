import Layout from "@/components/website/Layout";
import ComingSoon from "@/components/website/ComingSoon";

const EventsPage = () => (
  <Layout
    title="Events | SoSHSA"
    description="Join us for engaging programs, workshops, and community initiatives designed to empower students."
  >
    <ComingSoon
      title="Upcoming Events"
      description="Join us for engaging programs, workshops, and community initiatives designed to empower students across social sciences and humanities."
    />
  </Layout>
);

export default EventsPage;
