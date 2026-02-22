import { useState } from "react";
import { Save, Upload, Trash2 } from "lucide-react";
import Input from "@/components/dashboard/ui/InputField";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";
import Image from "next/image";
import Textarea from "@/components/dashboard/ui/TextArea";

const AssociationIntroPage = () => {
  const [formData, setFormData] = useState({
    videoUrl: "",
    title: "Welcome to SoSHSA",
    description:
      "The Social Sciences and Humanities Students' Association is dedicated to promoting academic excellence and student welfare.",
  });
  const [images, setImages] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    imageIndex: number | null;
  }>({
    isOpen: false,
    imageIndex: null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = () => {
    if (deleteModal.imageIndex !== null) {
      setImages(images.filter((_, index) => index !== deleteModal.imageIndex));
    }
    setDeleteModal({ isOpen: false, imageIndex: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving association intro:", { ...formData, images });
  };

  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <DashboardLayout pageTitle="Induction Intro">
      <div className="space-y-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
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
              className="border-teal-100"
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

          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
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
              className="border-teal-100"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
                <span className="text-red-500 ml-1">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                placeholder="Write additional information about SoSHSA..."
                className="border-teal-100"
                required
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Additional Images
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Upload images to accompany the introduction
                </p>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Upload size={16} />
                  Upload Images
                </label>
              </div>
            </div>

            {images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({ isOpen: true, imageIndex: index })
                      }
                      className="cursor-pointer absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No images uploaded yet</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="cursor-pointer flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, imageIndex: null })}
        onConfirm={handleDeleteImage}
        title="Delete Image"
        message="Are you sure you want to remove this image?"
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default AssociationIntroPage;
