import Image from "next/image";
import { useState } from "react";
import { renderStatusBadge } from "@/utils/badge";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Input from "@/components/dashboard/ui/InputField";
import { Plus, Edit, Trash2, Upload, Settings } from "lucide-react";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Council, Executive, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockCouncils: Council[] = [
  {
    id: "1",
    name: "20th Executive Members",
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "19th Executive Members",
    isActive: false,
    createdAt: "2023-01-01",
  },
];

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

const CouncilsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [councils, setCouncils] = useState(mockCouncils);
  const [executives, setExecutives] = useState(mockExecutives);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [councilSheetOpen, setCouncilSheetOpen] = useState(false);
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
    councilId: "",
    isActive: true,
  });
  const [councilFormData, setCouncilFormData] = useState({
    name: "",
  });
  const [editingCouncil, setEditingCouncil] = useState<Council | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    type: "executive" | "council";
  }>({
    isOpen: false,
    id: null,
    type: "executive",
  });

  const filteredExecutives = executives.filter(
    (exec) =>
      exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.councilName?.toLowerCase().includes(searchQuery.toLowerCase()),
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
        councilId: executive.councilId || "",
        isActive: executive.isActive,
      });
      setImagePreview(executive.image);
    } else {
      setEditingExecutive(null);
      setFormData({
        name: "",
        position: "",
        biography: "",
        councilId: "",
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
      councilId: "",
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

  const handleDelete = (id: string, type: "executive" | "council") => {
    if (type === "executive") {
      setExecutives(executives.filter((exec) => exec.id !== id));
    } else {
      setCouncils(councils.filter((council) => council.id !== id));
    }
    setDeleteModal({ isOpen: false, id: null, type: "executive" });
  };

  const handleOpenCouncilSheet = (council?: Council) => {
    if (council) {
      setEditingCouncil(council);
      setCouncilFormData({ name: council.name });
    } else {
      setEditingCouncil(null);
      setCouncilFormData({ name: "" });
    }
    setCouncilSheetOpen(true);
  };

  const handleCloseCouncilSheet = () => {
    setCouncilSheetOpen(false);
    setEditingCouncil(null);
    setCouncilFormData({ name: "" });
  };

  const handleCouncilSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCouncil) {
      setCouncils(
        councils.map((council) =>
          council.id === editingCouncil.id
            ? { ...council, name: councilFormData.name }
            : council,
        ),
      );
    } else {
      const newCouncil: Council = {
        id: Date.now().toString(),
        name: councilFormData.name,
        isActive: false,
        createdAt: new Date().toISOString(),
      };
      setCouncils([...councils, newCouncil]);
    }
    handleCloseCouncilSheet();
  };

  const handleToggleActiveCouncil = (id: string) => {
    setCouncils(
      councils.map((council) =>
        council.id === id
          ? { ...council, isActive: true }
          : { ...council, isActive: false },
      ),
    );
  };

  const columns: TableColumn<Executive>[] = [
    {
      key: "image",
      label: "Photo",
      render: (value: string | boolean | undefined, row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative">
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
      key: "councilName",
      label: "Council",
      render: (value: string | boolean | undefined) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: string | boolean | undefined) => renderStatusBadge(value as boolean),
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
      render: (value: string | boolean | undefined, row) => (
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
                id: value as string,
                type: "executive",
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
    <DashboardLayout pageTitle="Councils">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            placeholder="Search by name, position, or council..."
            onSearch={setSearchQuery}
            className="max-w-lg"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setCouncilSheetOpen(true)}
              className="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <Settings size={20} />
              Manage Councils
            </button>
            <button
              onClick={() => handleOpenSheet()}
              className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              Add Executive
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredExecutives}
          emptyMessage="No executives found"
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
              <div className="w-52 h-52 rounded-full overflow-hidden bg-gray-200 relative">
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
              setFormData({ ...formData, position: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Council
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.councilId}
              onChange={(e) =>
                setFormData({ ...formData, councilId: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              required
            >
              <option value="">Select a council</option>
              {councils.map((council) => (
                <option key={council.id} value={council.id}>
                  {council.name} {council.isActive && "(Active)"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
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
                setFormData({ ...formData, isActive: e.target.checked })
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

      <Sheet
        isOpen={councilSheetOpen}
        onClose={() => {
          if (!editingCouncil) {
            setCouncilSheetOpen(false);
          } else {
            handleCloseCouncilSheet();
          }
        }}
        title="Manage Councils"
      >
        {!editingCouncil ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">All Councils</h3>
              <button
                onClick={() => handleOpenCouncilSheet()}
                className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                <Plus size={16} />
                Add Council
              </button>
            </div>

            <div className="space-y-3">
              {councils.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No councils created yet
                </p>
              ) : (
                councils.map((council) => (
                  <div
                    key={council.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {council.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Created{" "}
                        {new Date(council.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleActiveCouncil(council.id)}
                        className={`px-3 py-1.5 text-xs font-medium rounded ${
                          council.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {council.isActive ? "Active" : "Set Active"}
                      </button>
                      <button
                        onClick={() => handleOpenCouncilSheet(council)}
                        className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            id: council.id,
                            type: "council",
                          })
                        }
                        className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCouncilSubmit} className="space-y-6">
            <Input
              label="Council Name"
              type="text"
              placeholder="e.g., 21st Executive Members"
              value={councilFormData.name}
              onChange={(e) => setCouncilFormData({ name: e.target.value })}
              required
            />

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                {editingCouncil ? "Update Council" : "Add Council"}
              </button>
              <button
                type="button"
                onClick={handleCloseCouncilSheet}
                className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Sheet>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: null, type: "executive" })
        }
        onConfirm={() =>
          deleteModal.id && handleDelete(deleteModal.id, deleteModal.type)
        }
        title={`Delete ${deleteModal.type === "executive" ? "Executive" : "Council"}`}
        message={`Are you sure you want to delete this ${deleteModal.type}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default CouncilsPage;
