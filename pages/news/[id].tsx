import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import Link from "next/link";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  imageUrl: string;
  createdAt: string;
}

const fetchArticle = async (articleId: string): Promise<NewsArticle> => {
  const { data } = await axios.get(`${BASE_URL}/news-articles/${articleId}`);
  return data.data;
};

const NewsDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: article, isLoading } = useSWR(id ? `news-${id}` : null, () =>
    fetchArticle(id as string),
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Layout title="SoSHSA | Loading..." description="Loading article">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading article...</p>
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout
        title="SoSHSA | Article Not Found"
        description="Article not found"
      >
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Article not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`SoSHSA | ${article.title}`} description={article.excerpt}>
      <article className="relative bg-white py-10 lg:py-15">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/news"
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
            Back to News
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 text-gray-600 mb-6">
              <span className="font-medium">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
              {article.title}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              {article.excerpt}
            </p>
          </motion.div>

          <motion.div
            className="relative w-full h-screen overflow-hidden mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              fill
              alt={article.title}
              src={article.imageUrl}
              className="object-cover"
            />
          </motion.div>

          {article.content && (
            <motion.div
              className="prose prose-lg max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {article.content}
              </p>
            </motion.div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetailPage;
