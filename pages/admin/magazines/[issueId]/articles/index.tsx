import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
// import { GetServerSideProps } from "next";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import { renderPublishedBadge } from "@/utils/badge";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Article, TableColumn } from "@/types/interface/dashboard";
import { Plus, Edit, Trash2, ArrowLeft, Upload } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockArticles: Article[] = [
  {
    id: "10",
    title: "The Future of Social Sciences",
    author: "Amie Jallow",
    content:
      "Social sciences are evolving rapidly in response to technological advancement and global challenges. This article explores emerging trends in sociology, psychology, and anthropology, examining how researchers are adapting their methodologies to address contemporary issues such as digital communication, climate change, and social inequality.\n\nThe integration of big data analytics and artificial intelligence into social science research has opened new avenues for understanding human behavior at scale. However, this technological shift also raises important questions about ethics, privacy, and the fundamental nature of social inquiry.",
    image: "/images/home/magazine-1.jpg",
    isPublished: true,
    createdAt: "2024-01-15",
  },
  {
    id: "11",
    title: "Understanding Cultural Dynamics",
    author: "Bakary Ceesay",
    content:
      "Cultural dynamics shape every aspect of human society, from language and religion to economic systems and political structures. This comprehensive study examines how cultures evolve, adapt, and influence one another in an increasingly interconnected world.\n\nThrough ethnographic research and comparative analysis, we explore the mechanisms of cultural change, the role of tradition in modern societies, and the complex relationship between globalization and cultural identity. Special attention is given to West African cultural practices and their transformation in contemporary contexts.",
    image: "/images/home/magazine-2.jpg",
    isPublished: true,
    createdAt: "2024-01-14",
  },
  {
    id: "12",
    title: "Research Methods in Sociology",
    author: "Fatou Sanneh",
    content:
      "Effective sociological research requires a solid understanding of both quantitative and qualitative methodologies. This article provides a comprehensive overview of research design, data collection techniques, and analytical approaches commonly used in sociological studies.\n\nWe examine the strengths and limitations of various research methods, including surveys, interviews, participant observation, and content analysis. Particular emphasis is placed on ethical considerations and the importance of reflexivity in social research.",
    image: "/images/home/magazine-3.jpg",
    isPublished: false,
    createdAt: "2024-01-13",
  },
];

const ArticlesPage = () => {
  const router = useRouter();
  const { issueId } = router.query;
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState(mockArticles);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    isPublished: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleView = (article: Article) => {
    setViewingArticle(article);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (article?: Article) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        author: article.author,
        content: article.content,
        isPublished: article.isPublished,
      });
      setImagePreview(article.image);
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        author: "",
        content: "",
        isPublished: true,
      });
      setImagePreview("");
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingArticle(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Article submitted:", formData);
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter((article) => article.id !== id));
  };

  const columns: TableColumn<Article>[] = [
    {
      key: "image",
      label: "Image",
      render: (value: string | boolean | undefined, row) => (
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
          <Image
            src={value as string}
            alt={row.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (value: string | boolean | undefined) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "author",
      label: "Author",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string | boolean | undefined) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value: string | boolean | undefined) =>
        renderPublishedBadge(value as boolean),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value: string | boolean | undefined, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSheet(row);
            }}
            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, id: row.id });
            }}
            className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle={`Issue ${issueId} - Articles`}>
      <div className="space-y-6">
        <Link
          href="/admin/magazines"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Magazine Issues
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search articles..."
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Article
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredArticles}
          emptyMessage="No articles found"
          onRowClick={handleView}
        />
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingArticle ? "Edit Article" : "Add Article"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Image
            </label>
            <div className="flex items-start gap-6">
              {imagePreview ? (
                <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-200 relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-48 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="article-image-upload"
                />
                <label
                  htmlFor="article-image-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} />
                  Upload Image
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 1200x800px
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Article Title"
            type="text"
            placeholder="Enter article title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Input
            label="Author"
            type="text"
            placeholder="Enter author name"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Article content..."
              required
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="isPublished"
              className="text-sm font-medium text-gray-700"
            >
              Publish immediately
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingArticle ? "Update Article" : "Add Article"}
            </button>
            <button
              type="button"
              onClick={handleCloseSheet}
              className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Sheet>

      <Sheet
        isOpen={viewSheetOpen}
        onClose={() => setViewSheetOpen(false)}
        title="Article Details"
      >
        {viewingArticle && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-200 h-200 rounded-sm overflow-hidden bg-gray-200 relative">
                <Image
                  src={viewingArticle.image}
                  alt={viewingArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Title
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {viewingArticle.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Author
                </label>
                <p className="text-gray-900">{viewingArticle.author}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Content
                </label>
                <div className="max-h-64 overflow-y-auto p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {viewingArticle.content || "No content available"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                {renderPublishedBadge(viewingArticle.isPublished)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Created
                </label>
                <p className="text-gray-900">
                  {new Date(viewingArticle.createdAt).toLocaleDateString(
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

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setViewSheetOpen(false);
                  handleOpenSheet(viewingArticle);
                }}
                className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setViewSheetOpen(false)}
                className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Article"
        message="Are you sure you want to delete this article? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const token = context.req.cookies.token || null;

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/admin/auth/sign-in",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default ArticlesPage;
