import useSWR from "swr";
import Image from "next/image";
import {
  Magazine,
  TableColumn,
  MagazinesResponse,
  DashboardPageProps,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import { renderPublishedBadge } from "@/utils/badge";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { CustomError, ErrorResponseData, FilterStatus } from "@/types";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const MagazinesPage = ({ adminData }: DashboardPageProps) => {
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);
  const [viewingMagazine, setViewingMagazine] = useState<Magazine | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    coverImageUrl: "",
    isPublished: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchMagazines = async (): Promise<MagazinesResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
      search: searchQuery,
    };

    if (filterStatus === "published") params.isPublished = "true";
    if (filterStatus === "draft") params.isPublished = "false";

    const { data } = await axios.get(`${BASE_URL}/magazines`, {
      params,
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["magazines", adminData.token, page, limit, searchQuery, filterStatus],
    fetchMagazines,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load magazines", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const magazines = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (magazine: Magazine) => {
    setViewingMagazine(magazine);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (magazine?: Magazine) => {
    if (magazine) {
      setEditingMagazine(magazine);
      setFormData({
        title: magazine.title,
        year: magazine.year,
        coverImageUrl: magazine.coverImageUrl,
        isPublished: magazine.isPublished,
      });
      setImagePreview(magazine.coverImageUrl);
      setImageFile(null);
    } else {
      setEditingMagazine(null);
      setFormData({
        title: "",
        year: new Date().getFullYear().toString(),
        coverImageUrl: "",
        isPublished: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingMagazine(null);
    setFormData({
      title: "",
      year: new Date().getFullYear().toString(),
      coverImageUrl: "",
      isPublished: true,
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToJeetix = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "soshsa/magazines");

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
      let coverImageUrl = formData.coverImageUrl;

      if (imageFile) {
        setUploadingImage(true);
        toast.loading("Uploading cover image...", { id: "upload-toast" });
        coverImageUrl = await uploadImageToJeetix(imageFile);
        toast.dismiss("upload-toast");
        setUploadingImage(false);
      }

      if (!coverImageUrl) {
        toast.error("Cover image is required");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        coverImageUrl,
      };

      const actionText = editingMagazine ? "Updating" : "Creating";
      toast.loading(`${actionText} magazine...`, { id: "action-toast" });

      if (editingMagazine) {
        await axios.patch(
          `${BASE_URL}/magazines/${editingMagazine.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
        toast.dismiss("action-toast");
        toast.success("Magazine updated successfully");
      } else {
        await axios.post(`${BASE_URL}/magazines`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Magazine created successfully");
      }
      mutate();
      handleCloseSheet();
    } catch (error) {
      toast.dismiss("upload-toast");
      toast.dismiss("action-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error(
        editingMagazine
          ? "Failed to update magazine"
          : "Failed to create magazine",
        {
          description: message,
          duration: 4000,
        },
      );
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/magazines/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.success("Magazine deleted successfully");
      mutate();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete magazine", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<Magazine>[] = [
    {
      key: "coverImageUrl",
      label: "Cover",
      render: (value, row) => (
        <div className="w-16 h-20 rounded overflow-hidden bg-gray-200 relative">
          <Image
            src={(value as string) || "/placeholder.png"}
            alt={row.title}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "year",
      label: "Year",
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value) => renderPublishedBadge(value as boolean),
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
            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, id: row.id });
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
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout pageTitle="Magazines" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search magazines..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

            <Button
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Magazine
            </Button>
          </div>

          <div className="flex flex-col items-center sm:flex-row gap-4 pt-6">
            <div>
              <h3 className="font-medium text-gray-900">Filters:</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("all");
                  setPage(1);
                }}
              >
                All
              </Button>
              <Button
                variant={filterStatus === "published" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("published");
                  setPage(1);
                }}
              >
                Published
              </Button>
              <Button
                variant={filterStatus === "draft" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("draft");
                  setPage(1);
                }}
              >
                Draft
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            data={magazines}
            loading={isLoading}
            emptyMessage="No magazines found"
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
          onClose={() => setViewSheetOpen(false)}
          title="Magazine Details"
        >
          {viewingMagazine && (
            <div className="space-y-6">
              <div className="w-full aspect-3/4 rounded-lg bg-gray-200 relative overflow-hidden">
                <Image
                  src={viewingMagazine.coverImageUrl}
                  alt={viewingMagazine.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {viewingMagazine.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Year
                  </label>
                  <p className="text-gray-900">{viewingMagazine.year}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderPublishedBadge(viewingMagazine.isPublished)}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingMagazine);
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
          isOpen={sheetOpen}
          onClose={handleCloseSheet}
          title={editingMagazine ? "Edit Magazine" : "Add Magazine"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start gap-6">
                {imagePreview ? (
                  <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-200 relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-48 h-64 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Upload size={32} className="text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    required={!editingMagazine && !imagePreview}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} />
                    {imagePreview ? "Change Cover" : "Upload Cover"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 800x1000px
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Magazine Title"
              type="text"
              placeholder="Enter magazine title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <Input
              label="Year"
              type="text"
              placeholder="2024"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              required
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isPublished"
                className="text-sm font-medium text-gray-700"
              >
                Publish immediately
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting || uploadingImage}
              >
                {uploadingImage
                  ? "Uploading Image..."
                  : editingMagazine
                    ? "Update Magazine"
                    : "Add Magazine"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting || uploadingImage}
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
          title="Delete Magazine"
          message="Are you sure you want to delete this magazine? This action cannot be undone."
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

export default MagazinesPage;
