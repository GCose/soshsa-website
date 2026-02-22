import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import NotFound from "@/components/website/NotFound";
import { ArticleDetailSkeleton } from "@/components/website/skeletons/Skeleton";

interface MagazineArticle {
  id: string;
  title: string;
  author: string;
  content?: string;
  imageUrl?: string;
  magazine: {
    _id: string;
    title: string;
  };
}

const fetchArticle = async (
  magazineId: string,
  articleId: string,
): Promise<MagazineArticle> => {
  const { data } = await axios.get(
    `${BASE_URL}/magazine-articles/${articleId}`,
  );
  return data.data;
};

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id: magazineId, articleId } = router.query;

  const { data: article, isLoading } = useSWR(
    magazineId && articleId ? `article-${articleId}` : null,
    () => fetchArticle(magazineId as string, articleId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  if (isLoading) {
    return (
      <Layout title="SOSHSA | Loading..." description="Loading article">
        <section className="relative bg-white py-10 lg:py-15">
          <ArticleDetailSkeleton />
        </section>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout
        title="SOSHSA | Article Not Found"
        description="Article not found"
      >
        <NotFound
          title="Article Not Found"
          message="This article may have been removed or is no longer available."
          backLink="/magazines"
          backText="Back to Magazines"
        />
      </Layout>
    );
  }

  return (
    <Layout title={`SOSHSA | ${article.title}`} description={article.title}>
      <article className="relative bg-white py-10 lg:py-15">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href={`/magazines/${article.magazine._id}`}
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
            Back to {article.magazine.title}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-600 mb-4">
              <Link
                href={`/magazines/${article.magazine._id}`}
                className="hover:text-primary transition-colors"
              >
                {article.magazine.title}
              </Link>
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg text-gray-600 mb-12">By {article.author}</p>
          </motion.div>

          {article.imageUrl && (
            <motion.div
              className="relative w-full h-screen mb-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-contain"
              />
            </motion.div>
          )}

          {article.content && (
            <motion.div
              className="prose prose-lg max-w-none mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </motion.div>
          )}

          <motion.div
            className="mt-16 border-t pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 text-center">
                Comments feature coming soon! User authentication required.
              </p>
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetailPage;
