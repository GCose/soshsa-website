import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const MagazineSection = () => {
  const magazines = [
    {
      id: 1,
      title: "Issue 12",
      year: "2024",
      cover: "/images/home/magazine-1.jpg",
    },
    {
      id: 2,
      title: "Issue 11",
      year: "2024",
      cover: "/images/home/magazine-2.jpg",
    },
    {
      id: 3,
      title: "Issue 10",
      year: "2023",
      cover: "/images/home/magazine-3.jpg",
    },
  ];

  return (
    <section className="relative min-h-screen bg-gray-900 py-20 lg:py-32">
      <div className="w-full px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-4">
            <motion.div
              className="lg:sticky lg:top-32"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary text-sm uppercase tracking-widest mb-4">
                Publications
              </p>
              <h2 className="text-fluid-4xl font-bold text-white leading-tight mb-6">
                SoSHSA
                <br />
                Magazine
              </h2>
              <p className="text-white/80 text-lg leading-relaxed mb-8">
                Our student-led magazine features thought-provoking articles,
                research insights, and stories from the social sciences and
                humanities community.
              </p>
              <Link
                href="/magazine"
                className="inline-flex items-center gap-3 text-white text-lg font-semibold group"
              >
                <span className="relative">
                  View All Issues
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform origin-left group-hover:scale-x-0" />
                </span>
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

          <motion.div
            className="col-span-12 lg:col-span-8"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 sm:col-span-6 lg:col-span-7">
                <Link
                  href={`/magazine/${magazines[0].id}`}
                  className="group block"
                >
                  <div className="relative aspect-3/4 bg-gray-800 overflow-hidden mb-4">
                    <Image
                      src={magazines[0].cover}
                      alt={magazines[0].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {magazines[0].title}
                    </h3>
                    <span className="text-white/60 text-sm">
                      {magazines[0].year}
                    </span>
                  </div>
                </Link>
              </div>

              <div className="col-span-12 sm:col-span-6 lg:col-span-5 lg:mt-12">
                <Link
                  href={`/magazine/${magazines[1].id}`}
                  className="group block mb-8"
                >
                  <div className="relative aspect-3/4 bg-gray-800 overflow-hidden mb-4">
                    <Image
                      src={magazines[1].cover}
                      alt={magazines[1].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {magazines[1].title}
                    </h3>
                    <span className="text-white/60 text-sm">
                      {magazines[1].year}
                    </span>
                  </div>
                </Link>

                <Link
                  href={`/magazine/${magazines[2].id}`}
                  className="group block"
                >
                  <div className="relative aspect-3/4 bg-gray-800 overflow-hidden mb-4">
                    <Image
                      src={magazines[2].cover}
                      alt={magazines[2].title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {magazines[2].title}
                    </h3>
                    <span className="text-white/60 text-sm">
                      {magazines[2].year}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
