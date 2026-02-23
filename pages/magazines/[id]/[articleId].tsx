import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import NotFound from "@/components/website/NotFound";
import { ArticleDetailSkeleton } from "@/components/website/skeletons/Skeleton";
import Input from "@/components/dashboard/ui/InputField";
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

interface Comment {
  id: string;
  fullName: string;
  comment: string;
  createdAt: string;
}

interface CommentsResponse {
  data: Comment[];
  meta: {
    total: number;
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

const fetchInitialComments = async (
  articleId: string,
): Promise<CommentsResponse> => {
  const { data } = await axios.get(`${BASE_URL}/magazine-article-comments`, {
    params: {
      articleId,
      isApproved: "true",
      page: 0,
      limit: 10,
    },
  });
  return data.data;
};

const ArticleDetailPage = () => {
  const router = useRouter();
  const { id: magazineId, articleId } = router.query;
  const [submitting, setSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState({
    fullName: "",
    email: "",
    comment: "",
  });
  const [commentsPage, setCommentsPage] = useState(0);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const { data: article, isLoading } = useSWR(
    magazineId && articleId ? `article-${articleId}` : null,
    () => fetchArticle(magazineId as string, articleId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: initialCommentsData } = useSWR(
    articleId ? `comments-${articleId}` : null,
    () => fetchInitialComments(articleId as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  useEffect(() => {
    if (initialCommentsData) {
      setAllComments(initialCommentsData.data);
      setTotalComments(initialCommentsData.meta.total);
    }
  }, [initialCommentsData]);

  const loadMoreComments = async () => {
    setLoadingMore(true);
    try {
      const nextPage = commentsPage + 1;
      const { data } = await axios.get(
        `${BASE_URL}/magazine-article-comments`,
        {
          params: {
            articleId,
            isApproved: "true",
            page: nextPage,
            limit: 10,
          },
        },
      );
      setAllComments((prev) => [...prev, ...data.data.data]);
      setCommentsPage(nextPage);
    } catch {
      toast.error("Failed to load more comments");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${BASE_URL}/magazine-article-comments`, {
        fullName: commentForm.fullName,
        email: commentForm.email,
        comment: commentForm.comment,
        articleId: articleId,
      });

      toast.success("Comment submitted! It will be reviewed by our team.");
      setCommentForm({ fullName: "", email: "", comment: "" });
    } catch {
      toast.error("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const hasMoreComments = allComments.length < totalComments;

  return (
    <>
      <Toaster position="top-right" richColors />
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
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Comments ({totalComments})
              </h2>

              {allComments.length > 0 && (
                <div className="space-y-6 mb-12 max-w-2xl">
                  {allComments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      className="bg-gray-50 rounded-lg p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                    </motion.div>
                  ))}

                  {hasMoreComments && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={loadMoreComments}
                        disabled={loadingMore}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? "Loading..." : "Load More Comments"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Leave a Comment
              </h3>

              <form
                onSubmit={handleCommentSubmit}
                className="max-w-2xl space-y-6"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    id="fullName"
                    value={commentForm.fullName}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        fullName: e.target.value,
                      })
                    }
                    required
                    className="border-teal-100"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={commentForm.email}
                    onChange={(e) =>
                      setCommentForm({ ...commentForm, email: e.target.value })
                    }
                    required
                    className="border-teal-100"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Comment <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="comment"
                    rows={6}
                    value={commentForm.comment}
                    onChange={(e) =>
                      setCommentForm({
                        ...commentForm,
                        comment: e.target.value,
                      })
                    }
                    required
                    maxLength={1000}
                    className="border-teal-100"
                    placeholder="Share your thoughts... (max 1000 characters)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {commentForm.comment.length}/1000 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Submit Comment"}
                </button>

                <p className="text-sm text-gray-500">
                  Your comment will be reviewed by our team before being
                  published.
                </p>
              </form>
            </motion.div>
          </div>
        </article>
      </Layout>
    </>
  );
};

export default ArticleDetailPage;
