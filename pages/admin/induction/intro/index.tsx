import useSWR from "swr";
import Image from "next/image";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import { isLoggedIn } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { getErrorMessage } from "@/utils/error";
import { Save, Upload, Trash2 } from "lucide-react";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import { DashboardPageProps } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const InductionIntroPage = ({ adminData }: DashboardPageProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [introId, setIntroId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    videoUrl: "",
    title: "",
    description: "",
    isPublished: false,
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [deleteImageModal, setDeleteImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string | null;
  }>({
    isOpen: false,
    imageUrl: null,
  });

  const { data: intros, mutate } = useSWR(
    ["association-intros", adminData.token],
    async () => {
      const { data } = await axios.get(`${BASE_URL}/association-intros`, {
        params: { page: 0, limit: 1 },
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      return data.data.data;
    },
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load induction intro", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  useEffect(() => {
    if (intros && intros.length > 0) {
      const intro = intros[0];
      setIntroId(intro.id);
      setFormData({
        videoUrl: intro.videoUrl || "",
        title: intro.title || "",
        description: intro.description || "",
        isPublished: intro.isPublished || false,
      });
      setExistingImages(intro.imageUrls || []);
    }
  }, [intros]);

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

      toast.loading(`${introId ? "Updating" : "Creating"} induction intro...`, {
        id: "submit-toast",
      });

      if (introId) {
        await axios.patch(
          `${BASE_URL}/association-intros/${introId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
      } else {
        const { data } = await axios.post(
          `${BASE_URL}/association-intros`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
        setIntroId(data.data.id);
      }

      toast.dismiss("submit-toast");
      toast.success(
        `Induction intro ${introId ? "updated" : "created"} successfully`,
      );

      setNewImageFiles([]);
      setImagePreviewUrls([]);
      mutate();
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

  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout pageTitle="Induction Intro" adminData={adminData}>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-teal-50 border-none rounded-lg p-6 space-y-6">
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

          <div className="bg-teal-50 border-none rounded-lg p-6 space-y-6">
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

          <div className="bg-teal-50 border-none rounded-lg p-6 space-y-6">
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

          <div className="bg-teal-50 border-none rounded-lg p-6">
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
                Publish to website (Make visible to students)
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Save size={20} />}
              disabled={submitting || uploadingImages}
              isLoading={submitting || uploadingImages}
            >
              {uploadingImages
                ? "Uploading Images..."
                : submitting
                  ? "Saving..."
                  : introId
                    ? "Update Intro"
                    : "Create Intro"}
            </Button>
          </div>
        </form>

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
