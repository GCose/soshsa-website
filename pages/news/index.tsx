import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import { NewsCardSkeleton } from "@/components/website/skeletons/Skeleton";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  imageUrl: string;
  createdAt: string;
}

const fetchPublishedNews = async (): Promise<NewsArticle[]> => {
  const { data } = await axios.get(`${BASE_URL}/news-articles`, {
    params: { isPublished: true, limit: 12 },
  });
  return data.data.data;
};

const NewsPage = () => {
  const { data: articles = [], isLoading } = useSWR(
    "published-news",
    fetchPublishedNews,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout
      title="SoSHSA | News"
      ogImage="/images/logo.jpeg"
      keywords="SOSHSA news, SOSHSA announcements, SOSHSA updates, SoSHSA UTG news, SoSHSA UTG announcements, SoSHSA UTG updates, SOSHSA events news, SOSHSA student news"
      description="Stay updated with the latest news and announcements from the Social Sciences and Humanities Students Association."
    >
      <section className="relative bg-white py-10 lg:py-15">
        <div className="w-full px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mb-16"
            viewport={{ once: true }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              Stay Informed
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Latest News
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Stay updated with the latest news, announcements, and stories from
              the Social Sciences and Humanities Students Association.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <NewsCardSkeleton key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-500 text-lg">
                No news articles available at the moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/news/${article.id}`} className="group block">
                    <div className="relative h-96 overflow-hidden bg-gray-200 mb-4">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                      <h3 className="text-xl uppercase font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
