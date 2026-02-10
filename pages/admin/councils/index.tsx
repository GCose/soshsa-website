import { useState } from "react";
import { useRouter } from "next/router";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Input from "@/components/dashboard/ui/InputField";
import { Plus, Edit, Trash2 } from "lucide-react";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Council, TableColumn } from "@/types/interface/dashboard";
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

const mockExecutives = [
  { id: "1", councilId: "1" },
  { id: "2", councilId: "1" },
  { id: "3", councilId: "1" },
  { id: "4", councilId: "1" },
  { id: "5", councilId: "2" },
];

const CouncilsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [councils, setCouncils] = useState(mockCouncils);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCouncil, setEditingCouncil] = useState<Council | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredCouncils = councils.filter((council) =>
    council.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getCouncilExecutivesCount = (councilId: string) => {
    return mockExecutives.filter((exec) => exec.councilId === councilId).length;
  };

  const handleViewCouncil = (council: Council) => {
    router.push(`/admin/councils/${council.id}`);
  };

  const handleOpenSheet = (council?: Council) => {
    if (council) {
      setEditingCouncil(council);
      setFormData({ name: council.name });
    } else {
      setEditingCouncil(null);
      setFormData({ name: "" });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingCouncil(null);
    setFormData({ name: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCouncil) {
      setCouncils(
        councils.map((council) =>
          council.id === editingCouncil.id
            ? { ...council, name: formData.name }
            : council,
        ),
      );
    } else {
      const newCouncil: Council = {
        id: Date.now().toString(),
        name: formData.name,
        isActive: false,
        createdAt: new Date().toISOString(),
      };
      setCouncils([...councils, newCouncil]);
    }
    handleCloseSheet();
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

  const handleDelete = (id: string) => {
    setCouncils(councils.filter((council) => council.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const columns: TableColumn<Council>[] = [
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
    <DashboardLayout pageTitle="Councils">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            placeholder="Search councils..."
            onSearch={setSearchQuery}
            className="max-w-lg"
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Council
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredCouncils}
          emptyMessage="No councils found"
          onRowClick={handleViewCouncil}
        />
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingCouncil ? "Edit Council" : "Add Council"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Council Name"
            type="text"
            placeholder="e.g., 21st Executive Members"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
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
        title="Delete Council"
        message="Are you sure you want to delete this council? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default CouncilsPage;
