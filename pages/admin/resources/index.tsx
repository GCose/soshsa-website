import { useState } from "react";
// import { useRouter } from "next/router";
// import { GetServerSideProps } from "next";
import { renderTypeBadge } from "@/utils/badge";
import Table from "@/components/dashboard/ui/Table";
import Input from "@/components/dashboard/ui/InputField";
import Modal from "@/components/dashboard/ui/modals/Modal";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Resource, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockResources: Resource[] = [
  {
    id: "1",
    title: "UTG Student Portal",
    description: "Access your academic records, grades, and registration",
    url: "https://portal.utg.edu.gm",
    category: "Academic",
    order: 1,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "UTG Library",
    description: "Browse digital resources and research materials",
    url: "https://library.utg.edu.gm",
    category: "Academic",
    order: 2,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "APA Citation Guide",
    description: "Learn proper citation formatting for academic writing",
    url: "https://apastyle.apa.org",
    category: "Resources",
    order: 3,
    createdAt: "2024-01-13",
  },
];

const ResourcesPage = () => {
  //   const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState(mockResources);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    resource: Resource | null;
  }>({
    isOpen: false,
    resource: null,
  });

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setResources(resources.filter((resource) => resource.id !== id));
  };

  const columns: TableColumn<Resource>[] = [
    {
      key: "title",
      label: "Title",
      render: (value: string | boolean | number) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (value: string | boolean | number) => (
        <span className="text-gray-700 truncate max-w-xs block">{value}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value: string | boolean | number) =>
        renderTypeBadge(value as string),
    },
    {
      key: "url",
      label: "URL",
      render: (value: string | boolean | number) => (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:text-primary/80 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-sm truncate max-w-[200px]">{value}</span>
          <ExternalLink size={12} />
        </a>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean | number, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModal({ isOpen: true, resource: row })}
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
    <DashboardLayout pageTitle="Resources">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search resources..."
          />
          <button
            onClick={() => setEditModal({ isOpen: true, resource: null })}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Resource
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredResources}
          emptyMessage="No resources found"
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      <Modal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, resource: null })}
        title={editModal.resource ? "Edit Resource" : "Add Resource"}
        size="md"
      >
        <form className="space-y-4">
          <Input
            label="Title"
            type="text"
            placeholder="Resource title"
            defaultValue={editModal.resource?.title || ""}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              defaultValue={editModal.resource?.description || ""}
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Brief description"
              required
            />
          </div>
          <Input
            label="URL"
            type="url"
            placeholder="https://example.com"
            defaultValue={editModal.resource?.url || ""}
            required
          />
          <Input
            label="Category"
            type="text"
            placeholder="e.g., Academic, Resources, Tools"
            defaultValue={editModal.resource?.category || ""}
            required
          />
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editModal.resource ? "Update" : "Add"} Resource
            </button>
            <button
              type="button"
              onClick={() => setEditModal({ isOpen: false, resource: null })}
              className="cursor-pointer px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
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

export default ResourcesPage;
