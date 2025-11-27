import Link from "next/link";
import { motion } from "framer-motion";

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => {
  return (
    <section className="relative min-h-screen bg-gray-900 flex items-center justify-center py-20">
      <div className="w-full px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-6">
            Coming Soon
          </p>
          <h1 className="text-fluid-5xl font-bold text-white leading-tight mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-white/80 text-xl leading-relaxed mb-12 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-primary/90 transition-colors group"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Back to Home
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors group"
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
          </div>
        </motion.div>

        <motion.div
          className="mt-20 pt-20 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-white/60 text-lg">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ComingSoon;
