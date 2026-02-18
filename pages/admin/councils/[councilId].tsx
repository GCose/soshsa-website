import useSWR from "swr";
import Image from "next/image";
import {
  Executive,
  TableColumn,
  DashboardPageProps,
  ExecutivesResponse,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import { renderStatusBadge } from "@/utils/badge";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { ArrowLeft, Plus, Edit, Trash2, Upload } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const ExecutivesPage = ({ adminData }: DashboardPageProps) => {
  const router = useRouter();
  const [limit] = useState(15);
  const { councilId } = router.query;
  const [page, setPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<Executive | null>(
    null,
  );
  const [viewingExecutive, setViewingExecutive] = useState<Executive | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    biography: "",
    profilePhoto: "",
    isServing: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchExecutives = async (): Promise<ExecutivesResponse> => {
    const { data } = await axios.get(`${BASE_URL}/executive-members`, {
      params: {
        council: councilId,
        page: page - 1,
        limit,
        search: searchQuery,
      },
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    councilId
      ? ["executives", adminData.token, councilId, page, limit, searchQuery]
      : null,
    fetchExecutives,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load executive members", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const executives = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (executive: Executive) => {
    setViewingExecutive(executive);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (executive?: Executive) => {
    if (executive) {
      setEditingExecutive(executive);
      setFormData({
        fullName: executive.fullName,
        position: executive.position,
        biography: executive.biography || "",
        profilePhoto: executive.profilePhoto || "",
        isServing: executive.isServing,
      });
      setImagePreview(executive.profilePhoto || "");
      setImageFile(null);
    } else {
      setEditingExecutive(null);
      setFormData({
        fullName: "",
        position: "",
        biography: "",
        profilePhoto: "",
        isServing: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingExecutive(null);
    setFormData({
      fullName: "",
      position: "",
      biography: "",
      profilePhoto: "",
      isServing: true,
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
    formData.append("folder", "soshsa/executives");

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
      let profilePhotoUrl = formData.profilePhoto;

      if (imageFile) {
        setUploadingImage(true);
        toast.loading("Uploading image...", { id: "upload-toast" });
        profilePhotoUrl = await uploadImageToJeetix(imageFile);
        toast.dismiss("upload-toast");
        setUploadingImage(false);
      }

      if (!profilePhotoUrl) {
        toast.error("Profile photo is required");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        profilePhoto: profilePhotoUrl,
        council: councilId as string,
      };

      const actionText = editingExecutive ? "Updating" : "Creating";
      toast.loading(`${actionText} executive member...`, {
        id: "action-toast",
      });

      if (editingExecutive) {
        await axios.patch(
          `${BASE_URL}/executive-members/${editingExecutive.id}`,
          payload,
          { headers: { Authorization: `Bearer ${adminData.token}` } },
        );
        toast.dismiss("action-toast");
        toast.success("Executive member updated successfully");
      } else {
        await axios.post(`${BASE_URL}/executive-members`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Executive member added successfully");
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
        editingExecutive
          ? "Failed to update executive member"
          : "Failed to add executive member",
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
      await axios.delete(`${BASE_URL}/executive-members/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.success("Executive member deleted successfully");
      mutate();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete executive member", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<Executive>[] = [
    {
      key: "profilePhoto",
      label: "Photo",
      render: (value, row) => (
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
          <Image
            src={(value as string) || "/placeholder.png"}
            alt={row.fullName}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "fullName",
      label: "Full Name",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "position",
      label: "Position",
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: "isServing",
      label: "Status",
      render: (value) =>
        renderStatusBadge(value as boolean, "Serving", "Inactive"),
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
      <DashboardLayout pageTitle="Executive Members" adminData={adminData}>
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/councils")}
              leftIcon={<ArrowLeft size={20} />}
            >
              Back to Councils
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search executives..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

            <Button
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Executive
            </Button>
          </div>

          <Table
            data={executives}
            columns={columns}
            loading={isLoading}
            emptyMessage="No executive members found"
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
          title="Executive Details"
          onClose={() => setViewSheetOpen(false)}
        >
          {viewingExecutive && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-200 h-200 rounded bg-gray-200 relative">
                  <Image
                    src={viewingExecutive.profilePhoto || "/placeholder.png"}
                    alt={viewingExecutive.fullName}
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
                    {viewingExecutive.fullName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Position
                  </label>
                  <p className="text-gray-900">{viewingExecutive.position}</p>
                </div>

                {viewingExecutive.biography && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Biography
                    </label>
                    <p className="text-gray-900">
                      {viewingExecutive.biography}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderStatusBadge(
                    viewingExecutive.isServing,
                    "Serving",
                    "Inactive",
                  )}
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
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingExecutive);
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
          title={
            editingExecutive ? "Edit Executive Member" : "Add Executive Member"
          }
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start gap-6">
                {imagePreview && (
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-photo-upload"
                    required={!editingExecutive && !imagePreview}
                  />
                  <label
                    htmlFor="profile-photo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} />
                    {imagePreview ? "Change Photo" : "Upload Photo"}
                  </label>
                </div>
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="e.g., John Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />

            <Input
              label="Position"
              type="text"
              placeholder="e.g., President"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />

            <Textarea
              label="Biography"
              value={formData.biography}
              onChange={(e) =>
                setFormData({ ...formData, biography: e.target.value })
              }
              rows={4}
              placeholder="Brief biography..."
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isServing"
                checked={formData.isServing}
                onChange={(e) =>
                  setFormData({ ...formData, isServing: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isServing"
                className="text-sm font-medium text-gray-700"
              >
                Currently serving
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
                  : editingExecutive
                    ? "Update Executive"
                    : "Add Executive"}
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
          title="Delete Executive Member"
          message="Are you sure you want to delete this executive member? This action cannot be undone."
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

export default ExecutivesPage;
