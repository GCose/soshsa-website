import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
// import { GetServerSideProps } from "next";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import { renderPublishedBadge } from "@/utils/badge";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, FileText, Upload } from "lucide-react";
import { MagazineIssue, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockMagazines: MagazineIssue[] = [
  {
    id: "10",
    title: "Issue 10",
    year: "2024",
    articlesCount: 8,
    isPublished: true,
    publishedAt: "2024-01-15",
    createdAt: "2024-01-15",
  },
  {
    id: "11",
    title: "Issue 11",
    year: "2024",
    articlesCount: 6,
    isPublished: true,
    publishedAt: "2024-01-10",
    createdAt: "2024-01-10",
  },
  {
    id: "12",
    title: "Issue 12",
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
  const [issueSheetOpen, setIssueSheetOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MagazineIssue | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [issueFormData, setIssueFormData] = useState({
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
      mag.year.includes(searchQuery),
  );

  const handleOpenIssueSheet = (issue?: MagazineIssue) => {
    if (issue) {
      setEditingIssue(issue);
      setIssueFormData({
        title: issue.title,
        year: issue.year,
        isPublished: issue.isPublished,
      });
    } else {
      setEditingIssue(null);
      setIssueFormData({
        title: "",
        year: new Date().getFullYear().toString(),
        isPublished: false,
      });
      setCoverImagePreview("");
    }
    setIssueSheetOpen(true);
  };

  const handleCloseIssueSheet = () => {
    setIssueSheetOpen(false);
    setEditingIssue(null);
    setCoverImagePreview("");
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Issue submitted:", issueFormData);
    handleCloseIssueSheet();
  };

  const handleDeleteIssue = (id: string) => {
    setMagazines(magazines.filter((mag) => mag.id !== id));
  };

  const issueColumns: TableColumn<MagazineIssue>[] = [
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
            onClick={() => handleOpenIssueSheet(row)}
            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() =>
              setDeleteModal({
                isOpen: true,
                id: value as string,
              })
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
            onClick={() => handleOpenIssueSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Issue
          </button>
        </div>

        <Table
          columns={issueColumns}
          data={filteredMagazines}
          emptyMessage="No magazine issues found"
        />
      </div>

      <Sheet
        isOpen={issueSheetOpen}
        onClose={handleCloseIssueSheet}
        title={editingIssue ? "Edit Magazine Issue" : "Add Magazine Issue"}
      >
        <form onSubmit={handleIssueSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image
            </label>
            <div className="flex items-start gap-6">
              {coverImagePreview ? (
                <div className="w-32 h-48 rounded-lg overflow-hidden bg-gray-200 relative">
                  <Image
                    src={coverImagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-32 h-48 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Upload size={32} className="text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} />
                  Upload Cover
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 400x600px
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Issue Title"
            type="text"
            placeholder="e.g., Issue 12"
            value={issueFormData.title}
            onChange={(e) =>
              setIssueFormData({ ...issueFormData, title: e.target.value })
            }
            required
          />

          <Input
            label="Year"
            type="text"
            placeholder="2024"
            value={issueFormData.year}
            onChange={(e) =>
              setIssueFormData({ ...issueFormData, year: e.target.value })
            }
            required
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="issuePublished"
              checked={issueFormData.isPublished}
              onChange={(e) =>
                setIssueFormData({
                  ...issueFormData,
                  isPublished: e.target.checked,
                })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="issuePublished"
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
              onClick={handleCloseIssueSheet}
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
        onConfirm={() => {
          if (deleteModal.id) {
            handleDeleteIssue(deleteModal.id);
          }
        }}
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
