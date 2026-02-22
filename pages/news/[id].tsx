import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import { useRouter } from "next/router";
import Layout from "@/components/website/Layout";
import { ArticleDetailSkeleton } from "@/components/website/skeletons/Skeleton";

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

  const { data: article, isLoading } = useSWR(
    id ? `news-${id}` : null,
    () => fetchArticle(id as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
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
        <section className="relative bg-white py-10 lg:py-15">
          <ArticleDetailSkeleton />
        </section>
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
            <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-600 mb-8">
                <span>By {article.author}</span>
                <span>•</span>
                <time>{formatDate(article.createdAt)}</time>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                {article.content && (
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default NewsDetailPage;
