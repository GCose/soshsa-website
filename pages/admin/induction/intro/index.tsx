import useSWR from "swr";
import Image from "next/image";
import {
  TableColumn,
  IntrosResponse,
  AssociationIntro,
  DashboardPageProps,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import useDebounce from "@/utils/debounce";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import { renderPublishedBadge } from "@/utils/badge";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import { Plus, Edit, Trash2, Upload } from "lucide-react";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const InductionIntroPage = ({ adminData }: DashboardPageProps) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewingIntro, setViewingIntro] = useState<AssociationIntro | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [editingIntro, setEditingIntro] = useState<AssociationIntro | null>(
    null,
  );
  const [formData, setFormData] = useState({
    videoUrl: "",
    title: "",
    description: "",
    isPublished: false,
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const [deleteImageModal, setDeleteImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string | null;
  }>({
    isOpen: false,
    imageUrl: null,
  });
  const limit = 15;

  const fetchIntros = async (): Promise<IntrosResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
    };
    if (debouncedSearch) params.search = debouncedSearch;

    const { data } = await axios.get(`${BASE_URL}/association-intros`, {
      params,
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["association-intros", adminData.token, page, debouncedSearch],
    fetchIntros,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load induction intros", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const intros = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (intro: AssociationIntro) => {
    setViewingIntro(intro);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (intro?: AssociationIntro) => {
    if (intro) {
      setEditingIntro(intro);
      setFormData({
        videoUrl: intro.videoUrl,
        title: intro.title,
        description: intro.description,
        isPublished: intro.isPublished,
      });
      setExistingImages(intro.imageUrls || []);
    } else {
      setEditingIntro(null);
      setFormData({
        videoUrl: "",
        title: "",
        description: "",
        isPublished: false,
      });
      setExistingImages([]);
    }
    setNewImageFiles([]);
    setImagePreviewUrls([]);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingIntro(null);
    setNewImageFiles([]);
    setImagePreviewUrls([]);
    setExistingImages([]);
  };

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setNewImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveExistingImage = () => {
    if (deleteImageModal.imageUrl) {
      setExistingImages((prev) =>
        prev.filter((url) => url !== deleteImageModal.imageUrl),
      );
    }
    setDeleteImageModal({ isOpen: false, imageUrl: null });
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToJeetix = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "soshsa/induction");

      const { data } = await axios.post(
        `${JEETIX_BASE_URL}/api/storage/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return data.data.metadata.mediaLink;
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let uploadedImageUrls: string[] = [];

      if (newImageFiles.length > 0) {
        setUploadingImages(true);
        toast.loading("Uploading images...", { id: "upload-images" });
        uploadedImageUrls = await uploadImagesToJeetix(newImageFiles);
        toast.dismiss("upload-images");
        setUploadingImages(false);
      }

      const allImageUrls = [...existingImages, ...uploadedImageUrls];

      const payload = {
        ...formData,
        imageUrls: allImageUrls,
      };

      toast.loading(
        `${editingIntro ? "Updating" : "Creating"} induction intro...`,
        { id: "submit-toast" },
      );

      if (editingIntro) {
        await axios.patch(
          `${BASE_URL}/association-intros/${editingIntro.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
      } else {
        await axios.post(`${BASE_URL}/association-intros`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
      }

      toast.dismiss("submit-toast");
      toast.success(
        `Induction intro ${editingIntro ? "updated" : "created"} successfully`,
      );

      mutate();
      handleCloseSheet();
    } catch (error) {
      toast.dismiss("upload-images");
      toast.dismiss("submit-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to save induction intro", {
        description: message,
        duration: 4000,
      });
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting induction intro...", { id: "delete-toast" });
      await axios.delete(`${BASE_URL}/association-intros/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.dismiss("delete-toast");
      toast.success("Induction intro deleted successfully");
      mutate();
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      toast.dismiss("delete-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete induction intro", {
        description: message,
        duration: 4000,
      });
    }
  };

  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const columns: TableColumn<AssociationIntro>[] = [
    {
      key: "title",
      label: "Title",
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: "videoUrl",
      label: "Video URL",
      render: (value) => (
        <span className="truncate max-w-xs block">{value as string}</span>
      ),
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value) => renderPublishedBadge(value as boolean),
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
            className="cursor-pointer hover:rounded-full p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
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
      <DashboardLayout pageTitle="Induction Intro" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              className="max-w-md"
              onSearch={handleSearch}
              placeholder="Search intros..."
            />
            <Button
              variant="primary"
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Intro
            </Button>
          </div>

          <Table
            columns={columns}
            data={intros}
            loading={isLoading}
            emptyMessage="No induction intros found"
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
          title="Intro Details"
        >
          {viewingIntro && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {viewingIntro.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Description
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {viewingIntro.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Video
                  </label>
                  {getVideoId(viewingIntro.videoUrl) && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${getVideoId(viewingIntro.videoUrl)}`}
                        title={viewingIntro.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>

                {viewingIntro.imageUrls &&
                  viewingIntro.imageUrls.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Images
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {viewingIntro.imageUrls.map((imageUrl, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                          >
                            <Image
                              src={imageUrl}
                              alt={`Image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderPublishedBadge(viewingIntro.isPublished)}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingIntro);
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
          title={editingIntro ? "Edit Intro" : "Add Intro"}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Video Content</h3>

              <Input
                label="YouTube Video URL"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, videoUrl: e.target.value })
                }
                helperText="Enter the full YouTube video URL"
                required
              />

              {formData.videoUrl && getVideoId(formData.videoUrl) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Preview
                  </label>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getVideoId(formData.videoUrl)}`}
                      title="Video preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">
                Supplementary Content
              </h3>

              <Input
                label="Title"
                type="text"
                placeholder="Welcome to SoSHSA"
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
                  rows={6}
                  placeholder="Write additional information about the association..."
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Supporting Images
                </h3>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleNewImageUpload}
                    className="hidden"
                    id="images-upload"
                  />
                  <label
                    htmlFor="images-upload"
                    className="cursor-pointer inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Upload size={16} />
                    Add Images
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    <Image
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteImageModal({ isOpen: true, imageUrl })
                      }
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {imagePreviewUrls.map((previewUrl, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    <Image
                      src={previewUrl}
                      alt={`New image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {existingImages.length === 0 && imagePreviewUrls.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No images added yet. Click {'"'}Add Images{'"'} to upload.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
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
                Publish to website (Make visible to students)
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={submitting || uploadingImages}
                isLoading={submitting || uploadingImages}
              >
                {uploadingImages
                  ? "Uploading..."
                  : submitting
                    ? "Saving..."
                    : editingIntro
                      ? "Update Intro"
                      : "Create Intro"}
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
          title="Delete Intro"
          message="Are you sure you want to delete this intro? This action cannot be undone."
          confirmText="Delete"
          type="danger"
        />

        <ConfirmationModal
          isOpen={deleteImageModal.isOpen}
          onClose={() => setDeleteImageModal({ isOpen: false, imageUrl: null })}
          onConfirm={handleRemoveExistingImage}
          title="Remove Image"
          message="Are you sure you want to remove this image?"
          confirmText="Remove"
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

export default InductionIntroPage;
