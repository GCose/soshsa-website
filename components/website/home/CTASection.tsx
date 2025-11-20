"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="relative min-h-screen bg-gray-900 py-20 lg:py-32">
      <div className="w-full px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-6">
            Join the Movement
          </p>
          <h2 className="text-fluid-5xl font-bold text-white leading-tight mb-8">
            Ready to Make an Impact?
          </h2>
          <p className="text-white/80 text-xl leading-relaxed">
            Whether you{"'"}re a current student, prospective member, or partner
            organization—we{"'"}re here to collaborate and grow together.
          </p>
        </motion.div>

        {/* 3-Column Grid with Visible Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10 mb-16">
          <motion.div
            className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-6xl font-bold text-primary mb-6">01</div>
            <h3 className="text-2xl font-bold text-white mb-4">For Students</h3>
            <p className="text-white/70 leading-relaxed">
              Join our vibrant community and access resources, events, and
              opportunities designed to support your academic journey.
            </p>
          </motion.div>

          <motion.div
            className="p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-6xl font-bold text-primary mb-6">02</div>
            <h3 className="text-2xl font-bold text-white mb-4">For Partners</h3>
            <p className="text-white/70 leading-relaxed">
              Collaborate with us on programs that empower and uplift students
              across social sciences and humanities.
            </p>
          </motion.div>

          <motion.div
            className="p-8 lg:p-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-6xl font-bold text-primary mb-6">03</div>
            <h3 className="text-2xl font-bold text-white mb-4">Contributors</h3>
            <p className="text-white/70 leading-relaxed">
              Share your insights through our magazine or participate in speaker
              programs and workshops.
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-primary/90 transition-colors group"
          >
            Get In Touch
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

          <Link
            href="/about"
            className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors group"
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
        </motion.div>

        {/* Stats Grid with Dividers */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-white/10 pt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="p-8 text-center border-r border-b md:border-b-0 border-white/10">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">
              Active Members
            </div>
          </div>
          <div className="p-8 text-center border-b md:border-b-0 md:border-r border-white/10">
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">
              Programs
            </div>
          </div>
          <div className="p-8 text-center border-r border-white/10">
            <div className="text-4xl font-bold text-primary mb-2">10+</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">
              Partners
            </div>
          </div>
          <div className="p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              Est. 2010
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wide">
              At UTG
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
