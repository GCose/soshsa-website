import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import { MagazineSkeleton } from "@/components/website/skeletons/Skeleton";

interface Magazine {
  id: string;
  title: string;
  year: string;
  coverImageUrl: string;
}

const fetchPublishedMagazines = async (): Promise<Magazine[]> => {
  const { data } = await axios.get(`${BASE_URL}/magazines`, {
    params: { isPublished: true, limit: 15 },
  });
  return data.data.data;
};

const MagazinesPage = () => {
  const { data: magazines = [], isLoading } = useSWR(
    "published-magazines",
    fetchPublishedMagazines,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const groupedByYear = magazines.reduce(
    (acc, magazine) => {
      if (!acc[magazine.year]) {
        acc[magazine.year] = [];
      }
      acc[magazine.year].push(magazine);
      return acc;
    },
    {} as Record<string, Magazine[]>,
  );

  const years = Object.keys(groupedByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <Layout
      title="SoSHSA | Magazines"
      description="Explore past issues of the SoSHSA Magazine featuring articles, research, and stories from our community."
    >
      <section className="relative bg-white py-10 lg:py-15">
        <div className="w-full px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              Our Publications
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              SoSHSA Magazine
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover insightful articles, research, and perspectives from
              students and faculty in the social sciences and humanities.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(10)].map((_, i) => (
                <MagazineSkeleton key={i} />
              ))}
            </div>
          ) : magazines.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                No Magazines Available
              </h1>
              <p className="text-gray-500 text-lg">
                No magazine issues available at the moment.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {years.map((year) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {year}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {groupedByYear[year].map((magazine, index) => (
                      <motion.div
                        key={magazine.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <Link
                          href={`/magazines/${magazine.id}`}
                          className="group block"
                        >
                          <div className="relative aspect-3/4 bg-gray-800 overflow-hidden mb-4">
                            <Image
                              src={magazine.coverImageUrl}
                              alt={magazine.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                              {magazine.title}
                            </h3>
                            <span className="text-gray-500 text-sm">
                              {magazine.year}
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MagazinesPage;
