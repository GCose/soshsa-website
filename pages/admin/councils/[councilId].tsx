import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import { renderStatusBadge } from "@/utils/badge";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, ArrowLeft, Upload } from "lucide-react";
import { Executive, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockExecutives: Executive[] = [
  {
    id: "1",
    name: "Fatou Sanneh",
    position: "President",
    image: "/images/about/exec-1.jpg",
    isActive: true,
    councilId: "1",
    councilName: "20th Executive Members",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Lamin Bah",
    position: "Vice President",
    image: "/images/about/exec-2.jpg",
    isActive: true,
    councilId: "1",
    councilName: "20th Executive Members",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Mariama Drammeh",
    position: "Secretary General",
    image: "/images/about/exec-3.jpg",
    isActive: true,
    councilId: "1",
    councilName: "20th Executive Members",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Ebrima Jallow",
    position: "Treasurer",
    image: "/images/about/exec-4.jpg",
    isActive: true,
    councilId: "1",
    councilName: "20th Executive Members",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Awa Touray",
    position: "Public Relations Officer",
    image: "/images/about/exec-5.jpg",
    isActive: false,
    councilId: "2",
    councilName: "19th Executive Members",
    createdAt: "2024-01-11",
  },
];

const CouncilExecutivesPage = () => {
  const router = useRouter();
  const { councilId } = router.query;
  const [searchQuery, setSearchQuery] = useState("");
  const [executives, setExecutives] = useState(mockExecutives);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<Executive | null>(
    null,
  );
  const [viewingExecutive, setViewingExecutive] = useState<Executive | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    biography: "",
    isActive: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const councilExecutives = executives.filter(
    (exec) => exec.councilId === councilId,
  );
  const councilName = councilExecutives[0]?.councilName || "Council";

  const filteredExecutives = councilExecutives.filter(
    (exec) =>
      exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.position.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleView = (executive: Executive) => {
    setViewingExecutive(executive);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (executive?: Executive) => {
    if (executive) {
      setEditingExecutive(executive);
      setFormData({
        name: executive.name,
        position: executive.position,
        biography: "",
        isActive: executive.isActive,
      });
      setImagePreview(executive.image);
    } else {
      setEditingExecutive(null);
      setFormData({
        name: "",
        position: "",
        biography: "",
        isActive: true,
      });
      setImagePreview("");
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingExecutive(null);
    setFormData({
      name: "",
      position: "",
      biography: "",
      isActive: true,
    });
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
    setExecutives(executives.filter((exec) => exec.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const columns: TableColumn<Executive>[] = [
    {
      key: "image",
      label: "Photo",
      render: (value: string | boolean | undefined, row) => (
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
          <Image
            src={value as string}
            alt={row.name}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value: string | boolean | undefined) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "position",
      label: "Position",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: string | boolean | undefined) =>
        renderStatusBadge(value as boolean),
    },
    {
      key: "createdAt",
      label: "Date Added",
      render: (value: string | boolean | undefined) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    {
      key: "id",
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
              setDeleteModal({
                isOpen: true,
                id: row.id,
              });
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
    <DashboardLayout pageTitle={councilName}>
      <div className="space-y-6">
        <Link
          href="/admin/councils"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Councils
        </Link>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search executives..."
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Executive
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredExecutives}
          emptyMessage="No executives in this council"
          onRowClick={handleView}
        />
      </div>

      <Sheet
        isOpen={viewSheetOpen}
        onClose={() => setViewSheetOpen(false)}
        title="Executive Details"
      >
        {viewingExecutive && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-200 h-200 rounded bg-gray-200 relative">
                <Image
                  src={viewingExecutive.image}
                  alt={viewingExecutive.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Name
                </label>
                <p className="text-gray-900 font-medium text-lg">
                  {viewingExecutive.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Position
                </label>
                <p className="text-gray-900">{viewingExecutive.position}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Council
                </label>
                <p className="text-gray-900">{viewingExecutive.councilName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                {renderStatusBadge(viewingExecutive.isActive)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Date Added
                </label>
                <p className="text-gray-900">
                  {new Date(viewingExecutive.createdAt).toLocaleDateString(
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
                  handleOpenSheet(viewingExecutive);
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
        title={editingExecutive ? "Edit Executive" : "Add Executive"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-start gap-6">
              {imagePreview && (
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary transition-colors">
                  <Upload size={20} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Upload Photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Position"
            type="text"
            value={formData.position}
            onChange={(e) =>
              setFormData({
                ...formData,
                position: e.target.value,
              })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              value={formData.biography}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  biography: e.target.value,
                })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Brief biography..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.checked,
                })
              }
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              Active (currently serving)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingExecutive ? "Update Executive" : "Add Executive"}
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
        title="Delete Executive"
        message="Are you sure you want to delete this executive? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default CouncilExecutivesPage;
