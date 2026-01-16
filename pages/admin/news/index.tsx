import { useState } from "react";
// import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Table from "@/components/dashboard/ui/Table";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { TableColumn } from "@/types/interface/dashboard";
import SearchBar from "@/components/dashboard/ui/SearchBar";
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
      render: (value: string | boolean) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
            value
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-yellow-100 text-yellow-700 border-yellow-300"
          }`}
        >
          {value ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/news/${value}`)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/admin/news/${value}/edit`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() =>
              setDeleteModal({ isOpen: true, id: value as string })
            }
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
            onClick={() => router.push("/admin/news/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "published"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
