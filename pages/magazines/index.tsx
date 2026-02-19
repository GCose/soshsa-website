import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";

interface Magazine {
  id: string;
  title: string;
  year: string;
  coverImageUrl: string;
}

const fetchPublishedMagazines = async (): Promise<Magazine[]> => {
  const { data } = await axios.get(`${BASE_URL}/magazines`, {
    params: { isPublished: true, limit: 50 },
  });
  return data.data.data;
};

const MagazinesPage = () => {
  const { data: magazines = [] } = useSWR(
    "published-magazines",
    fetchPublishedMagazines,
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
      title="Magazine | SoSHSA"
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

          {magazines.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-500 text-lg">
                No magazine issues available at the moment.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-16">
              {years.map((year) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    {year}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {groupedByYear[year].map((magazine, index) => (
                      <motion.div
                        key={magazine.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Link
                          href={`/magazines/${magazine.id}`}
                          className="group block"
                        >
                          <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-gray-200 shadow-md group-hover:shadow-xl transition-shadow">
                            <Image
                              src={magazine.coverImageUrl}
                              alt={magazine.title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </div>
                          <h3 className="mt-3 text-lg uppercase font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                            {magazine.title}
                          </h3>
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
