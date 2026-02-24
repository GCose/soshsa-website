import { useState, useCallback } from "react";
import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import { Plus, Edit, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import { isLoggedIn } from "@/utils/auth";
import { getErrorMessage } from "@/utils/error";
import useDebounce from "@/utils/debounce";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import { renderPublishedBadge } from "@/utils/badge";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";
import { TableColumn, DashboardPageProps } from "@/types/interface/dashboard";
import Image from "next/image";

interface PortalGuideSection {
  id: string;
  heading: string;
  body: string;
  imageUrl?: string;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PortalGuideSectionsResponse {
  data: PortalGuideSection[];
  meta: {
    total: number;
  };
}

type FilterStatus = "all" | "published" | "draft";

const PortalGuidePage = ({ adminData }: DashboardPageProps) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewingSection, setViewingSection] =
    useState<PortalGuideSection | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingSection, setEditingSection] =
    useState<PortalGuideSection | null>(null);
  const [formData, setFormData] = useState({
    heading: "",
    body: "",
    imageUrl: "",
    order: 1,
    isPublished: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const limit = 15;

  const fetchSections = async (): Promise<PortalGuideSectionsResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (filterStatus === "published") params.isPublished = "true";
    if (filterStatus === "draft") params.isPublished = "false";

    const { data } = await axios.get(`${BASE_URL}/portal-guide`, {
      params,
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["portal-guide", adminData.token, page, debouncedSearch, filterStatus],
    fetchSections,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load portal guide sections", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const sections = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (section: PortalGuideSection) => {
    setViewingSection(section);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (section?: PortalGuideSection) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        heading: section.heading,
        body: section.body,
        imageUrl: section.imageUrl || "",
        order: section.order,
        isPublished: section.isPublished,
      });
      setImagePreview(section.imageUrl || "");
      setImageFile(null);
    } else {
      setEditingSection(null);
      const nextOrder =
        sections.length > 0 ? Math.max(...sections.map((s) => s.order)) + 1 : 1;
      setFormData({
        heading: "",
        body: "",
        imageUrl: "",
        order: nextOrder,
        isPublished: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingSection(null);
    setImageFile(null);
    setImagePreview("");
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
    formData.append("folder", "soshsa/portal-guide");

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
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        setUploadingImage(true);
        toast.loading("Uploading image...", { id: "upload-toast" });
        imageUrl = await uploadImageToJeetix(imageFile);
        toast.dismiss("upload-toast");
        setUploadingImage(false);
      }

      const payload = {
        heading: formData.heading,
        body: formData.body,
        imageUrl: imageUrl || undefined,
        order: formData.order,
        isPublished: formData.isPublished,
      };

      toast.loading(`${editingSection ? "Updating" : "Creating"} section...`, {
        id: "submit-toast",
      });

      if (editingSection) {
        await axios.patch(
          `${BASE_URL}/portal-guide/${editingSection.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
      } else {
        await axios.post(`${BASE_URL}/portal-guide`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
      }

      toast.dismiss("submit-toast");
      toast.success(
        `Section ${editingSection ? "updated" : "created"} successfully`,
      );

      mutate();
      handleCloseSheet();
    } catch (error) {
      toast.dismiss("upload-toast");
      toast.dismiss("submit-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to save section", {
        description: message,
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting section...", { id: "delete-toast" });
      await axios.delete(`${BASE_URL}/portal-guide/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.dismiss("delete-toast");
      toast.success("Section deleted successfully");
      mutate();
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      toast.dismiss("delete-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete section", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<PortalGuideSection>[] = [
    {
      key: "order",
      label: "Order",
      render: (value) => `#${value}`,
    },
    {
      key: "heading",
      label: "Heading",
    },
    {
      key: "body",
      label: "Body",
      render: (value) => (
        <span className="truncate max-w-md block">{value as string}</span>
      ),
    },
    {
      key: "imageUrl",
      label: "Image",
      render: (value) =>
        value ? (
          <span className="inline-flex items-center gap-1 text-xs text-green-600">
            <ImageIcon size={14} />
            Yes
          </span>
        ) : (
          <span className="text-xs text-gray-400">No</span>
        ),
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
      <DashboardLayout pageTitle="Portal Guide" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
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

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search sections..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

            <Button
              variant="primary"
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Section
            </Button>
          </div>

          <Table
            columns={columns}
            data={sections}
            loading={isLoading}
            emptyMessage="No portal guide sections found"
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
          title="Section Details"
        >
          {viewingSection && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Order
                  </label>
                  <p className="text-gray-900">#{viewingSection.order}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Heading
                  </label>
                  <p className="text-gray-900 text-lg">
                    {viewingSection.heading}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Body
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {viewingSection.body}
                  </p>
                </div>

                {viewingSection.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Image
                    </label>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={viewingSection.imageUrl}
                        alt={viewingSection.heading}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderPublishedBadge(viewingSection.isPublished)}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingSection);
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
          size="xl"
          isOpen={sheetOpen}
          onClose={handleCloseSheet}
          title={editingSection ? "Edit Section" : "Add Section"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: Number(e.target.value) })
              }
              required
            />

            <Input
              label="Heading"
              type="text"
              placeholder="e.g., Logging into the Portal"
              value={formData.heading}
              onChange={(e) =>
                setFormData({ ...formData, heading: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                rows={8}
                placeholder="Detailed instructions for this step..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum 5000 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              {imagePreview && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                accept="image/*"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} />
                {imagePreview ? "Change Image" : "Upload Image"}
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isPublished" className="text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting || uploadingImage}
              >
                {uploadingImage
                  ? "Uploading..."
                  : editingSection
                    ? "Update Section"
                    : "Add Section"}
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
          title="Delete Section"
          message="Are you sure you want to delete this section? This action cannot be undone."
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

export default PortalGuidePage;
