import Image from "next/image";
import { useState } from "react";
// import { GetServerSideProps } from "next";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import { renderPublishedBadge } from "@/utils/badge";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { NewsArticle, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "SoSHSA Wins Best Student Association Award",
    excerpt:
      "The Social Sciences and Humanities Students Association has been recognized for excellence in student leadership...",
    author: "Admin User",
    image: "/images/about/story-1.jpg",
    isPublished: true,
    publishedAt: "2024-01-15",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "New Academic Programs Announced for 2024",
    excerpt:
      "The university announces several new programs in social sciences and humanities fields...",
    author: "Admin User",
    image: "/images/about/story-2.jpg",
    isPublished: true,
    publishedAt: "2024-01-14",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Upcoming Career Fair for Social Sciences Students",
    excerpt:
      "Mark your calendars for the annual career fair connecting students with potential employers...",
    author: "Admin User",
    image: "/images/about/story-3.jpg",
    isPublished: false,
    publishedAt: "",
    createdAt: "2024-01-13",
  },
];

type FilterStatus = "all" | "published" | "draft";

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [news, setNews] = useState(mockNews);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(
    null,
  );
  const [viewingArticle, setViewingArticle] = useState<NewsArticle | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Admin User",
    isPublished: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredNews = news.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && article.isPublished) ||
      (filterStatus === "draft" && !article.isPublished);

    return matchesSearch && matchesFilter;
  });

  const handleView = (article: NewsArticle) => {
    setViewingArticle(article);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (article?: NewsArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: "",
        author: article.author,
        isPublished: article.isPublished,
      });
      setImagePreview(article.image);
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        author: "Admin User",
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
    console.log("Form submitted:", formData);
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setNews(news.filter((article) => article.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const columns: TableColumn<NewsArticle>[] = [
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
      key: "publishedAt",
      label: "Published",
      render: (value: string | boolean | undefined) =>
        value
          ? new Date(value as string).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            })
          : "-",
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
    <DashboardLayout pageTitle="News">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            onSearch={setSearchQuery}
            className="flex-1 max-w-md"
            placeholder="Search news..."
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add News Article
          </button>
        </div>

        <div className="flex flex-col items-center sm:flex-row gap-4 mt-10">
          <div>
            <h1>Filters:</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "published"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "draft"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Draft
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredNews}
          onRowClick={handleView}
          emptyMessage="No news articles found"
        />
      </div>

      <Sheet
        isOpen={viewSheetOpen}
        onClose={() => setViewSheetOpen(false)}
        title="News Article Details"
      >
        {viewingArticle && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-full h-full aspect-video rounded-sm overflow-hidden bg-gray-200 relative">
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
                  Excerpt
                </label>
                <p className="text-gray-900">{viewingArticle.excerpt}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Author
                </label>
                <p className="text-gray-900">{viewingArticle.author}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                {renderPublishedBadge(viewingArticle.isPublished)}
              </div>

              {viewingArticle.publishedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Published Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewingArticle.publishedAt).toLocaleDateString(
                      "en-GB",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
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

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingArticle ? "Edit News Article" : "Add News Article"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
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
                  id="news-image-upload"
                />
                <label
                  htmlFor="news-image-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} />
                  Upload Image
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 1200x630px
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief summary of the article..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Full article content..."
              required
            />
          </div>

          <Input
            label="Author"
            type="text"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            required
          />

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
              {editingArticle ? "Update Article" : "Publish Article"}
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

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete News Article"
        message="Are you sure you want to delete this news article? This action cannot be undone."
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

export default NewsPage;
