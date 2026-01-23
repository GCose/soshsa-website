import { useState } from "react";
import Image from "next/image";
// import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import { renderPublishedBadge } from "@/utils/badge";
import Input from "@/components/dashboard/ui/InputField";
import { TableColumn } from "@/types/interface/dashboard";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, Eye, Upload } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "SoSHSA Wins Best Student Association Award",
    excerpt:
      "The Social Sciences and Humanities Students Association has been recognized for excellence in student leadership...",
    author: "Admin User",
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
    isPublished: false,
    publishedAt: "",
    createdAt: "2024-01-13",
  },
];

type FilterStatus = "all" | "published" | "draft";

const NewsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [news, setNews] = useState(mockNews);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(
    null
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
  };

  const columns: TableColumn<NewsArticle>[] = [
    {
      key: "title",
      label: "Title",
      render: (value: string | boolean) => (
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
      render: (value: string | boolean) =>
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
      render: (value: string | boolean) =>
        renderPublishedBadge(value as boolean),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/news/${value}`)}
            className="cursor-pointer p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleOpenSheet(row)}
            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() =>
              setDeleteModal({ isOpen: true, id: value as string })
            }
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
          emptyMessage="No news articles found"
        />
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingArticle ? "Edit News Article" : "Add News Article"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
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
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
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
            label="Title"
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
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Brief summary (140-160 characters)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={15}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Write the full article content here..."
              required
            />
          </div>

          <Input
            label="Author"
            type="text"
            placeholder="Author name"
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
