import Link from "next/link";
import { motion } from "framer-motion";

interface NotFoundProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backLink?: string;
  backText?: string;
}

const NotFound = ({
  title = "Page Not Found",
  message = "Sorry, we couldn't find what you're looking for.",
  showBackButton = true,
  backLink = "/",
  backText = "Back to Home",
}: NotFoundProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        className="max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <svg
            className="w-24 h-24 md:w-32 md:h-32 mx-auto text-primary/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {message}
        </motion.p>

        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              href={backLink}
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {backText}
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default NotFound;
