import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import { useRouter } from "next/router";
import Layout from "@/components/website/Layout";
import { MagazineDetailSkeleton } from "@/components/website/skeletons/Skeleton";

interface Magazine {
  id: string;
  title: string;
  year: string;
  coverImageUrl: string;
}

interface MagazineArticle {
  id: string;
  title: string;
  author: string;
  imageUrl?: string;
}

const fetchMagazine = async (magazineId: string): Promise<Magazine> => {
  const { data } = await axios.get(`${BASE_URL}/magazines/${magazineId}`);
  return data.data;
};

const fetchMagazineArticles = async (
  magazineId: string,
): Promise<MagazineArticle[]> => {
  const { data } = await axios.get(`${BASE_URL}/magazine-articles`, {
    params: { magazine: magazineId, isPublished: true, limit: 50 },
  });
  return data.data.data;
};

const MagazineDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: magazine, isLoading: magazineLoading } = useSWR(
    id ? `magazine-${id}` : null,
    () => fetchMagazine(id as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: articles = [], isLoading: articlesLoading } = useSWR(
    id ? `magazine-articles-${id}` : null,
    () => fetchMagazineArticles(id as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const isLoading = magazineLoading || articlesLoading;

  if (isLoading) {
    return (
      <Layout title="SoSHSA | Loading..." description="Loading magazine">
        <section className="relative bg-white py-10 lg:py-15">
          <MagazineDetailSkeleton />
        </section>
      </Layout>
    );
  }

  if (!magazine) {
    return (
      <Layout
        title="SoSHSA | Magazine Not Found "
        description="Magazine not found"
      >
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Magazine not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`SoSHSA | ${magazine.title}`} description={magazine.title}>
      <section className="relative bg-white py-10 lg:py-15">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/magazines"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8 group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
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
            Back to Magazines
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="sticky top-8">
                <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-gray-200 shadow-xl">
                  <Image
                    src={magazine.coverImageUrl}
                    alt={magazine.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm uppercase tracking-wide text-primary font-medium mb-4">
                {magazine.year}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                {magazine.title}
              </h1>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Articles in this Issue
                </h2>
                {articles.length === 0 ? (
                  <p className="text-gray-500">
                    No articles available in this issue yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {articles.map((article, index) => (
                      <motion.div
                        key={article.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <Link
                          href={`/magazines/${magazine.id}/${article.id}`}
                          className="group block p-4 rounded-lg border border-teal-200 hover:scale-95 transition-all duration-700"
                        >
                          <div className="flex gap-4">
                            {article.imageUrl && (
                              <div className="relative w-24 h-24 rounded overflow-hidden bg-gray-200 shrink-0">
                                <Image
                                  src={article.imageUrl}
                                  alt={article.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-2">
                                {article.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                By {article.author}
                              </p>
                            </div>
                            <div className="flex items-center text-primary">
                              <svg
                                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MagazineDetailPage;
