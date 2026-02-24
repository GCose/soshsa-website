import { useState, useCallback } from "react";
import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import { isLoggedIn } from "@/utils/auth";
import useDebounce from "@/utils/debounce";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";
import { TableColumn, DashboardPageProps } from "@/types/interface/dashboard";

interface CitationFile {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  format: string;
  createdAt: string;
  updatedAt: string;
}

interface CitationsResponse {
  data: CitationFile[];
  meta: {
    total: number;
  };
}

const CitationFilesPage = ({ adminData }: DashboardPageProps) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewingCitation, setViewingCitation] = useState<CitationFile | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editingCitation, setEditingCitation] = useState<CitationFile | null>(
    null,
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "APA",
    format: "PDF",
    fileUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const limit = 15;

  const fetchCitations = async (): Promise<CitationsResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
    };
    if (debouncedSearch) params.search = debouncedSearch;

    const { data } = await axios.get(`${BASE_URL}/citation-files`, {
      params,
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["citation-files", page, debouncedSearch],
    fetchCitations,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load citation files", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const citations = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (citation: CitationFile) => {
    setViewingCitation(citation);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (citation?: CitationFile) => {
    if (citation) {
      setEditingCitation(citation);
      setFormData({
        title: citation.title,
        description: citation.description,
        category: citation.category,
        format: citation.format,
        fileUrl: citation.fileUrl,
      });
    } else {
      setEditingCitation(null);
      setFormData({
        title: "",
        description: "",
        category: "APA",
        format: "PDF",
        fileUrl: "",
      });
    }
    setFile(null);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingCitation(null);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFileToJeetix = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "soshsa/citations");

    const { data } = await axios.post(
      `${JEETIX_BASE_URL}/api/storage/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data.data.fileUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let fileUrl = formData.fileUrl;

      if (file) {
        setUploadingFile(true);
        toast.loading("Uploading file...", { id: "upload-toast" });
        fileUrl = await uploadFileToJeetix(file);
        toast.dismiss("upload-toast");
        setUploadingFile(false);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        format: formData.format,
        fileUrl,
      };

      toast.loading(
        `${editingCitation ? "Updating" : "Creating"} citation file...`,
        { id: "submit-toast" },
      );

      if (editingCitation) {
        await axios.patch(
          `${BASE_URL}/citation-files/${editingCitation.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
      } else {
        await axios.post(`${BASE_URL}/citation-files`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
      }

      toast.dismiss("submit-toast");
      toast.success(
        `Citation file ${editingCitation ? "updated" : "created"} successfully`,
      );

      mutate();
      handleCloseSheet();
    } catch (error) {
      toast.dismiss("upload-toast");
      toast.dismiss("submit-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to save citation file", {
        description: message,
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
      setUploadingFile(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting citation file...", { id: "delete-toast" });
      await axios.delete(`${BASE_URL}/citation-files/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.dismiss("delete-toast");
      toast.success("Citation file deleted successfully");
      mutate();
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      toast.dismiss("delete-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete citation file", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<CitationFile>[] = [
    {
      key: "title",
      label: "Title",
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: "category",
      label: "Category",
      render: (value) => (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">
          {value as string}
        </span>
      ),
    },
    {
      key: "format",
      label: "Format",
      render: (value) => (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
          {value as string}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenSheet(row);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, id: row.id });
            }}
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
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout pageTitle="Citation Files" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              className="max-w-md"
              onSearch={handleSearch}
              placeholder="Search citation files..."
            />
            <Button
              variant="primary"
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Citation File
            </Button>
          </div>

          <Table
            columns={columns}
            data={citations}
            loading={isLoading}
            emptyMessage="No citation files found"
            onRowClick={handleView}
            pagination={{
              page,
              totalPages,
              total: data?.meta.total,
              onPageChange: setPage,
            }}
          />
        </div>

        <Sheet
          isOpen={viewSheetOpen}
          title="Citation File Details"
          onClose={() => setViewSheetOpen(false)}
        >
          {viewingCitation && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {viewingCitation.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {viewingCitation.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Category
                    </label>
                    <p className="text-gray-900">{viewingCitation.category}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Format
                    </label>
                    <p className="text-gray-900">{viewingCitation.format}</p>
                  </div>
                </div>

                {viewingCitation.fileUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      File
                    </label>
                    <a
                      href={viewingCitation.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingCitation);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setViewSheetOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Sheet>

        <Sheet
          size="lg"
          isOpen={sheetOpen}
          onClose={handleCloseSheet}
          title={editingCitation ? "Edit Citation File" : "Add Citation File"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="e.g., APA 7th Edition Guide"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Describe this citation resource..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                  Format <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({ ...formData, format: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                  <option value="MP4">MP4</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File{" "}
                {!editingCitation && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx,.mp4"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} />
                {file
                  ? file.name
                  : editingCitation && formData.fileUrl
                    ? "Change File"
                    : "Upload File"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Accepted formats: PDF, DOCX, MP4
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting || uploadingFile}
                disabled={!editingCitation && !file}
              >
                {uploadingFile
                  ? "Uploading..."
                  : editingCitation
                    ? "Update Citation File"
                    : "Add Citation File"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseSheet}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Sheet>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null })}
          onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
          title="Delete Citation File"
          message="Are you sure you want to delete this citation file? This action cannot be undone."
          confirmText="Delete"
          type="danger"
        />
      </DashboardLayout>
    </>
  );
};

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  const adminData = isLoggedIn(req);

  if (!adminData) {
    return {
      redirect: {
        destination: "/admin/auth/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: { adminData },
  };
};

export default CitationFilesPage;
