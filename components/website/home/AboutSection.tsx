"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const AboutSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <section className="relative min-h-screen bg-white py-20 lg:py-32">
      <div className="w-full px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <motion.div className="lg:col-span-7" {...fadeInUp}>
            <div className="mb-8">
              <p className="text-primary text-sm uppercase tracking-widest mb-3">
                Who We Are
              </p>
              <h2 className="text-fluid-4xl font-bold text-gray-900 leading-tight">
                Bridging Students,
                <br />
                Building Futures
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed mb-12">
              <p>
                The Social Sciences and Humanities Students Association is one
                of UTG{"'"}s most vibrant sub-associations, uniting hundreds of
                students across diverse academic units.
              </p>
              <p>
                Since our formation, we{"'"}ve pioneered purpose-driven
                partnerships, community radio programs, and campus initiatives
                that serve as the vital link between students, the Students
                Union, and university authorities.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  500+
                </div>
                <div className="text-gray-600 text-sm uppercase tracking-wide">
                  Active Members
                </div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                  15+
                </div>
                <div className="text-gray-600 text-sm uppercase tracking-wide">
                  Community Programs
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 lg:border-l lg:border-gray-300 lg:pl-10"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-primary/10 p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Focus
              </h3>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">→</span>
                  <span className="text-gray-700">
                    Democratic student representation
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">→</span>
                  <span className="text-gray-700">
                    Community engagement & outreach
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">→</span>
                  <span className="text-gray-700">
                    Knowledge sharing & collaboration
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary text-xl">→</span>
                  <span className="text-gray-700">
                    Student welfare & development
                  </span>
                </li>
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-gray-900 text-lg font-medium group border-b-2 border-gray-900 pb-1 hover:border-primary hover:text-primary transition-colors"
              >
                Learn More About Us
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-2"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
