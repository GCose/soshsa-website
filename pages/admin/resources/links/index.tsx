import useSWR from "swr";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import { isLoggedIn } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import useDebounce from "@/utils/debounce";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { TableColumn, DashboardPageProps } from "@/types/interface/dashboard";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description: string;
  fileUrl?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface LinksResponse {
  data: UsefulLink[];
  meta: {
    total: number;
  };
}

const UsefulLinksPage = ({ adminData }: DashboardPageProps) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewingLink, setViewingLink] = useState<UsefulLink | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editingLink, setEditingLink] = useState<UsefulLink | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "",
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

  const fetchLinks = async (): Promise<LinksResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
    };
    if (debouncedSearch) params.search = debouncedSearch;

    const { data } = await axios.get(`${BASE_URL}/useful-links`, {
      params,
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["useful-links", page, debouncedSearch],
    fetchLinks,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load useful links", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const links = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (link: UsefulLink) => {
    setViewingLink(link);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (link?: UsefulLink) => {
    if (link) {
      setEditingLink(link);
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description,
        category: link.category,
        fileUrl: link.fileUrl || "",
      });
    } else {
      setEditingLink(null);
      setFormData({
        title: "",
        url: "",
        description: "",
        category: "",
        fileUrl: "",
      });
    }
    setFile(null);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingLink(null);
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
    formData.append("folder", "soshsa/links");

    const { data } = await axios.post(
      `${JEETIX_BASE_URL}/api/storage/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data.data.metadata.mediaLink;
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
        url: formData.url,
        description: formData.description,
        category: formData.category,
        fileUrl: fileUrl || undefined,
      };

      toast.loading(`${editingLink ? "Updating" : "Creating"} useful link...`, {
        id: "submit-toast",
      });

      if (editingLink) {
        await axios.patch(
          `${BASE_URL}/useful-links/${editingLink.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
      } else {
        await axios.post(`${BASE_URL}/useful-links`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
      }

      toast.dismiss("submit-toast");
      toast.success(
        `Useful link ${editingLink ? "updated" : "created"} successfully`,
      );

      mutate();
      handleCloseSheet();
    } catch (error) {
      toast.dismiss("upload-toast");
      toast.dismiss("submit-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to save useful link", {
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
      toast.loading("Deleting useful link...", { id: "delete-toast" });
      await axios.delete(`${BASE_URL}/useful-links/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.dismiss("delete-toast");
      toast.success("Useful link deleted successfully");
      mutate();
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      toast.dismiss("delete-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete useful link", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<UsefulLink>[] = [
    {
      key: "title",
      label: "Title",
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: "url",
      label: "URL",
      render: (value) => (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline truncate max-w-xs block"
          onClick={(e) => e.stopPropagation()}
        >
          {value as string}
        </a>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (value) => (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
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
      <DashboardLayout pageTitle="Useful Links" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              className="max-w-md"
              onSearch={handleSearch}
              placeholder="Search useful links..."
            />
            <Button
              variant="primary"
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Link
            </Button>
          </div>

          <Table
            columns={columns}
            data={links}
            loading={isLoading}
            emptyMessage="No useful links found"
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
          title="Link Details"
          isOpen={viewSheetOpen}
          onClose={() => setViewSheetOpen(false)}
        >
          {viewingLink && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {viewingLink.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    URL
                  </label>
                  <a
                    href={viewingLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {viewingLink.url}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {viewingLink.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900">{viewingLink.category}</p>
                </div>

                {viewingLink.fileUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Attached File
                    </label>
                    <a
                      href={viewingLink.fileUrl}
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
                    handleOpenSheet(viewingLink);
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
          title={editingLink ? "Edit Link" : "Add Link"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              type="text"
              placeholder="e.g., UTG Library Portal"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <Input
              label="URL"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
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
                placeholder="Describe this link..."
                required
              />
            </div>

            <Input
              label="Category"
              type="text"
              placeholder="e.g., Library, Research, Portal"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attached File (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} />
                {file
                  ? file.name
                  : editingLink && formData.fileUrl
                    ? "Change File"
                    : "Upload File"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Optional: Attach a PDF or DOCX file (e.g., guide, manual)
              </p>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting || uploadingFile}
              >
                {uploadingFile
                  ? "Uploading..."
                  : editingLink
                    ? "Update Link"
                    : "Add Link"}
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
          title="Delete Link"
          message="Are you sure you want to delete this link? This action cannot be undone."
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

export default UsefulLinksPage;
