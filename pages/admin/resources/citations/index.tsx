import { useState } from "react";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { renderTypeBadge } from "@/utils/badge";
import { CitationFile, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockCitations: CitationFile[] = [
  {
    id: "1",
    title: "APA 7th Edition Style Guide",
    description: "Complete guide for APA formatting and citations",
    file: "apa-7th-edition.pdf",
    fileUrl: "/files/apa-7th-edition.pdf",
    format: "PDF",
    size: 2458624,
    category: "APA",
    downloads: 245,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "MLA 8th Edition Handbook",
    description: "MLA formatting and style guidelines",
    file: "mla-8th-edition.pdf",
    fileUrl: "/files/mla-8th-edition.pdf",
    format: "PDF",
    size: 1843200,
    category: "MLA",
    downloads: 189,
    createdAt: "2024-01-14",
  },
];

const CitationFilesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [citations, setCitations] = useState(mockCitations);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCitation, setEditingCitation] = useState<CitationFile | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "APA" as CitationFile["category"],
    file: null as File | null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredCitations = citations.filter(
    (citation) =>
      citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citation.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      citation.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleOpenSheet = (citation?: CitationFile) => {
    if (citation) {
      setEditingCitation(citation);
      setFormData({
        title: citation.title,
        description: citation.description,
        category: citation.category,
        file: null,
      });
    } else {
      setEditingCitation(null);
      setFormData({
        title: "",
        description: "",
        category: "APA",
        file: null,
      });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingCitation(null);
    setFormData({ title: "", description: "", category: "APA", file: null });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCitation) {
      setCitations(
        citations.map((citation) =>
          citation.id === editingCitation.id
            ? {
                ...citation,
                title: formData.title,
                description: formData.description,
                category: formData.category,
              }
            : citation,
        ),
      );
    } else {
      const newCitation: CitationFile = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        file: formData.file?.name || "",
        fileUrl: `/files/${formData.file?.name}`,
        format: formData.file?.name.endsWith(".pdf")
          ? "PDF"
          : formData.file?.name.endsWith(".docx")
            ? "DOCX"
            : "MP4",
        size: formData.file?.size || 0,
        category: formData.category,
        downloads: 0,
        createdAt: new Date().toISOString(),
      };
      setCitations([...citations, newCitation]);
    }
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setCitations(citations.filter((citation) => citation.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const columns: TableColumn<CitationFile>[] = [
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
      key: "format",
      label: "Format",
      render: (value: string | boolean | number) => (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
          {value}
        </span>
      ),
    },
    {
      key: "size",
      label: "Size",
      render: (value: string | boolean | number) => (
        <span className="text-sm text-gray-600">
          {formatFileSize(value as number)}
        </span>
      ),
    },
    {
      key: "downloads",
      label: "Downloads",
      render: (value: string | boolean | number) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean | number, row) => (
        <div className="flex items-center gap-2">
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
    <DashboardLayout pageTitle="Citation Files">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search citation files..."
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Upload File
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredCitations}
          emptyMessage="No citation files uploaded"
        />
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={handleCloseSheet}
        title={editingCitation ? "Edit Citation File" : "Upload Citation File"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            type="text"
            placeholder="e.g., APA 7th Edition Style Guide"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Brief description of the file"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as CitationFile["category"],
                })
              }
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              required
            >
              <option value="APA">APA</option>
              <option value="MLA">MLA</option>
              <option value="Chicago">Chicago</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File
              {!editingCitation && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="file"
              accept=".pdf,.docx,.mp4"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              {formData.file
                ? formData.file.name
                : editingCitation
                  ? "Change File"
                  : "Choose File"}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Accepted formats: PDF, DOCX, MP4
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingCitation ? "Update File" : "Upload File"}
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
        title="Delete Citation File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default CitationFilesPage;
