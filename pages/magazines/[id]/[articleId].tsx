import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import NotFound from "@/components/website/NotFound";
import Button from "@/components/dashboard/ui/Button";
import Textarea from "@/components/dashboard/ui/TextArea";

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
  const [commentText, setCommentText] = useState("");

  const { data: article, isLoading } = useSWR(
    magazineId && articleId ? `article-${articleId}` : null,
    () => fetchArticle(magazineId as string, articleId as string),
  );

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No functionality - API doesn't exist
    alert("Comment feature coming soon! User authentication required.");
    setCommentText("");
  };

  if (isLoading) {
    return (
      <Layout title="SOSHSA | Loading..." description="Loading article">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading article...</p>
        </div>
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
              className="relative w-full h-screen  mb-12"
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
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {article.content}
              </p>
            </motion.div>
          )}

          <motion.div
            className="border-t border-gray-200 pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You must be logged in to comment on
                articles. User authentication feature coming soon.
              </p>
            </div>

            <form onSubmit={handleCommentSubmit} className="mb-12">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                placeholder="Share your thoughts on this article... (Login required)"
                className="mb-4"
                disabled
              />
              <Button type="submit" variant="primary" disabled>
                Post Comment (Coming Soon)
              </Button>
            </form>

            <div className="space-y-6">
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-gray-500">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default ArticleDetailPage;
