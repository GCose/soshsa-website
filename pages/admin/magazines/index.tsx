import { useState } from "react";
import { useRouter } from "next/router";
// import { GetServerSideProps } from "next";
import Table from "@/components/dashboard/ui/Table";
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
      render: (value: string | boolean | number) => (
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
      render: (value: string | boolean | number) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/admin/magazines/${value}/articles`)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Manage Articles"
          >
            <FileText size={16} />
          </button>
          <button
            onClick={() => router.push(`/admin/magazines/${value}/edit`)}
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
    <DashboardLayout pageTitle="Magazine">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search issues..."
          />
          <button
            onClick={() => router.push("/admin/magazines/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
