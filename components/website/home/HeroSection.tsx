import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative min-h-screen w-full flex items-center -mt-20 overflow-hidden">
    <div className="absolute inset-0">
      <Image
        fill
        priority
        sizes="100vw"
        alt="SoSHSA Community"
        className="object-cover"
        src="/images/home/hero.jpeg"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/10 to-black/90" />
    </div>

    <div className="relative w-full px-4 sm:px-6 lg:px-8 py-32">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-fluid-5xl font-bold text-white leading-[0.95] tracking-tight mb-8">
            School of Social Science
            <br />
            <span className="text-primary">& Humanities</span>
            <br />
            Students Association
          </h1>
        </motion.div>

        <motion.div
          className="w-32 h-px bg-white mx-auto mb-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="text-2xl lg:text-5xl font-bold text-primary mb-2">
              500+
            </div>
            <div className="text-white/80 text-sm uppercase tracking-wider">
              Active Students
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-5xl font-bold text-primary mb-2">
              15+
            </div>
            <div className="text-white/80 text-sm uppercase tracking-wider">
              Programs
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-5xl font-bold text-primary mb-2">
              Est. 2010
            </div>
            <div className="text-white/80 text-sm uppercase tracking-wider">
              At UTG
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-3 text-white text-lg font-medium group border-b-2 border-white pb-2 hover:border-primary hover:text-primary transition-colors"
          >
            Discover Our Story
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
      </div>
    </div>
  </section>
);

export default HeroSection;
