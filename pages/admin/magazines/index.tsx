import { useState } from "react";
import { useRouter } from "next/router";
// import { GetServerSideProps } from "next";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import { renderPublishedBadge } from "@/utils/badge";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { MagazineIssue, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockMagazines: MagazineIssue[] = [
  {
    id: "1",
    title: "Issue 12",
    year: "2024",
    articlesCount: 8,
    isPublished: true,
    publishedAt: "2024-01-15",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Issue 11",
    year: "2024",
    articlesCount: 6,
    isPublished: true,
    publishedAt: "2024-01-10",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    title: "Issue 10",
    year: "2023",
    articlesCount: 0,
    isPublished: false,
    publishedAt: "",
    createdAt: "2024-01-05",
  },
];

const MagazinePage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [magazines, setMagazines] = useState(mockMagazines);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MagazineIssue | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    isPublished: false,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredMagazines = magazines.filter(
    (mag) =>
      mag.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mag.year.includes(searchQuery)
  );

  const handleOpenSheet = (issue?: MagazineIssue) => {
    if (issue) {
      setEditingIssue(issue);
      setFormData({
        title: issue.title,
        year: issue.year,
        isPublished: issue.isPublished,
      });
    } else {
      setEditingIssue(null);
      setFormData({
        title: "",
        year: new Date().getFullYear().toString(),
        isPublished: false,
      });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingIssue(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setMagazines(magazines.filter((mag) => mag.id !== id));
  };

  const columns: TableColumn<MagazineIssue>[] = [
    {
      key: "title",
      label: "Issue",
      render: (value: string | boolean | number) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "year",
      label: "Year",
    },
    {
      key: "articlesCount",
      label: "Articles",
      render: (value: string | boolean | number) => (
        <span className="text-gray-700">
          {value} {value === 1 ? "article" : "articles"}
        </span>
      ),
    },
    {
      key: "publishedAt",
      label: "Published",
      render: (value: string | boolean | number) =>
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
      render: (value: string | boolean | number) =>
        renderPublishedBadge(value as boolean),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean | number, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/admin/magazines/${value}/articles`)}
            className="cursor-pointer p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Manage Articles"
          >
            <FileText size={16} />
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
    <DashboardLayout pageTitle="Magazine">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search issues..."
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Issue
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredMagazines}
          emptyMessage="No magazine issues found"
        />
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingIssue ? "Edit Magazine Issue" : "Add Magazine Issue"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Issue Title"
            type="text"
            placeholder="e.g., Issue 12"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <Input
            label="Year"
            type="text"
            placeholder="2024"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
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
              Publish issue
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingIssue ? "Update Issue" : "Add Issue"}
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
        title="Delete Magazine Issue"
        message="Are you sure you want to delete this magazine issue? This will also delete all articles within it. This action cannot be undone."
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

export default MagazinePage;
