import Image from "next/image";
import { useState } from "react";
import { renderStatusBadge } from "@/utils/badge";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Input from "@/components/dashboard/ui/InputField";
import { Plus, Edit, Trash2, Upload, ArrowLeft } from "lucide-react";
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
  const [selectedCouncil, setSelectedCouncil] = useState<Council | null>(null);
  const [councilSheetOpen, setCouncilSheetOpen] = useState(false);
  const [executiveSheetOpen, setExecutiveSheetOpen] = useState(false);
  const [viewExecutiveSheetOpen, setViewExecutiveSheetOpen] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<Council | null>(null);
  const [editingExecutive, setEditingExecutive] = useState<Executive | null>(
    null,
  );
  const [viewingExecutive, setViewingExecutive] = useState<Executive | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState("");
  const [councilFormData, setCouncilFormData] = useState({
    name: "",
  });
  const [executiveFormData, setExecutiveFormData] = useState({
    name: "",
    position: "",
    biography: "",
    isActive: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    type: "executive" | "council";
  }>({
    isOpen: false,
    id: null,
    type: "executive",
  });

  const filteredCouncils = councils.filter((council) =>
    council.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCouncilExecutivesCount = (councilId: string) => {
    return executives.filter((exec) => exec.councilId === councilId).length;
  };

  const getCouncilExecutives = (councilId: string) => {
    return executives.filter((exec) => exec.councilId === councilId);
  };

  const handleViewCouncil = (council: Council) => {
    setSelectedCouncil(council);
  };

  const handleBackToCouncils = () => {
    setSelectedCouncil(null);
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

  const handleViewExecutive = (executive: Executive) => {
    setViewingExecutive(executive);
    setViewExecutiveSheetOpen(true);
  };

  const handleOpenExecutiveSheet = (executive?: Executive) => {
    if (executive) {
      setEditingExecutive(executive);
      setExecutiveFormData({
        name: executive.name,
        position: executive.position,
        biography: "",
        isActive: executive.isActive,
      });
      setImagePreview(executive.image);
    } else {
      setEditingExecutive(null);
      setExecutiveFormData({
        name: "",
        position: "",
        biography: "",
        isActive: true,
      });
      setImagePreview("");
    }
    setExecutiveSheetOpen(true);
  };

  const handleCloseExecutiveSheet = () => {
    setExecutiveSheetOpen(false);
    setEditingExecutive(null);
    setExecutiveFormData({
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

  const handleExecutiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", executiveFormData);
    handleCloseExecutiveSheet();
  };

  const handleDelete = (id: string, type: "executive" | "council") => {
    if (type === "executive") {
      setExecutives(executives.filter((exec) => exec.id !== id));
    } else {
      setCouncils(councils.filter((council) => council.id !== id));
    }
    setDeleteModal({ isOpen: false, id: null, type: "executive" });
  };

  const councilColumns: TableColumn<Council>[] = [
    {
      key: "name",
      label: "Council Name",
      render: (value: string | boolean | undefined) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "id",
      label: "Members",
      render: (value: string | boolean | undefined) => (
        <span className="text-gray-600">
          {getCouncilExecutivesCount(value as string)} members
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: string | boolean | undefined) => (
        <span>
          {value ? (
            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded border bg-green-100 text-green-700 border-green-300">
              Active
            </span>
          ) : (
            <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded border bg-gray-100 text-gray-700 border-gray-300">
              Inactive
            </span>
          )}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string | boolean | undefined) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value: string | boolean | undefined, row) => (
        <div className="flex items-center gap-2">
          {!row.isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggleActiveCouncil(row.id);
              }}
              className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              Set Active
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenCouncilSheet(row);
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
                type: "council",
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

  const executiveColumns: TableColumn<Executive>[] = [
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
      key: "actions",
      label: "Actions",
      render: (_value: string | boolean | undefined, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenExecutiveSheet(row);
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
      {!selectedCouncil ? (
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search councils..."
              onSearch={setSearchQuery}
              className="max-w-lg"
            />
            <button
              onClick={() => handleOpenCouncilSheet()}
              className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              Add Council
            </button>
          </div>

          <Table
            columns={councilColumns}
            data={filteredCouncils}
            emptyMessage="No councils found"
            onRowClick={handleViewCouncil}
          />
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToCouncils}
              className="cursor-pointer p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCouncil.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {getCouncilExecutivesCount(selectedCouncil.id)} executive
                members
              </p>
            </div>
            <button
              onClick={() => handleOpenExecutiveSheet()}
              className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={20} />
              Add Executive
            </button>
          </div>

          <Table
            columns={executiveColumns}
            data={getCouncilExecutives(selectedCouncil.id)}
            emptyMessage="No executives in this council"
            onRowClick={handleViewExecutive}
          />
        </div>
      )}

      <Sheet
        isOpen={councilSheetOpen}
        onClose={handleCloseCouncilSheet}
        title={editingCouncil ? "Edit Council" : "Add Council"}
      >
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
      </Sheet>

      <Sheet
        isOpen={viewExecutiveSheetOpen}
        onClose={() => setViewExecutiveSheetOpen(false)}
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
                  setViewExecutiveSheetOpen(false);
                  handleOpenExecutiveSheet(viewingExecutive);
                }}
                className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setViewExecutiveSheetOpen(false)}
                className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet
        isOpen={executiveSheetOpen}
        onClose={handleCloseExecutiveSheet}
        title={editingExecutive ? "Edit Executive" : "Add Executive"}
      >
        <form onSubmit={handleExecutiveSubmit} className="space-y-6">
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
            value={executiveFormData.name}
            onChange={(e) =>
              setExecutiveFormData({
                ...executiveFormData,
                name: e.target.value,
              })
            }
            required
          />

          <Input
            label="Position"
            type="text"
            value={executiveFormData.position}
            onChange={(e) =>
              setExecutiveFormData({
                ...executiveFormData,
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
              value={executiveFormData.biography}
              onChange={(e) =>
                setExecutiveFormData({
                  ...executiveFormData,
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
              checked={executiveFormData.isActive}
              onChange={(e) =>
                setExecutiveFormData({
                  ...executiveFormData,
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
              onClick={handleCloseExecutiveSheet}
              className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
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
