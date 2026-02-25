import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";

interface PortalGuideSection {
  id: string;
  heading: string;
  body: string;
  imageUrl?: string;
  order: number;
}

const fetchSections = async (): Promise<PortalGuideSection[]> => {
  const { data } = await axios.get(`${BASE_URL}/portal-guides`);
  return data.data.data || [];
};

const PortalGuidePage = () => {
  const { data: sections = [], isLoading } = useSWR(
    "portal-guide-public",
    fetchSections,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  return (
    <Layout
      ogImage="/images/logo.jpeg"
      title="SoSHSA | UTG Portal Guide"
      description="Complete guide to using the UTG Student Portal"
      keywords="UTG portal guide, UTG student portal, how to use UTG portal, UTG portal navigation, UTG portal tutorial, UTG portal help, SoSHSA UTG portal guide"
    >
      <section className="relative bg-white py-15 lg:py-15">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              Student Resources
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              UTG Portal Guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              A comprehensive guide to help you navigate and use the UTG Student
              Portal
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-64 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                The portal guide is currently being prepared. Please check back
                soon.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  className="border-b border-gray-200 pb-16 last:border-0"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                      {section.order}
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900">
                      {section.heading}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {section.body}
                    </p>

                    {section.imageUrl && (
                      <div className="relative w-full h-screen overflow-hidden">
                        <Image
                          src={section.imageUrl}
                          alt={section.heading}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="mt-16 p-8 bg-primary/5 rounded-lg border border-primary/20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-700 mb-6">
              If you{"'"}re experiencing issues with the portal or need
              additional assistance, please contact the IT Help Desk or reach
              out to SoSHSA.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Us
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PortalGuidePage;
