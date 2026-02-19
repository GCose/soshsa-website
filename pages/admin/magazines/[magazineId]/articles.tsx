import useSWR from "swr";
import Image from "next/image";
import {
  TableColumn,
  MagazineArticle,
  DashboardPageProps,
  ArticlesResponse,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { useRouter } from "next/router";
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
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { ArrowLeft, Plus, Edit, Trash2, Upload } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const MagazineArticlesPage = ({ adminData }: DashboardPageProps) => {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const router = useRouter();
  const { magazineId } = router.query;
  const [editingArticle, setEditingArticle] = useState<MagazineArticle | null>(
    null,
  );
  const [viewingArticle, setViewingArticle] = useState<MagazineArticle | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    imageUrl: "",
    isPublished: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchArticles = async (): Promise<ArticlesResponse> => {
    const { data } = await axios.get(`${BASE_URL}/magazine-articles`, {
      params: {
        magazine: magazineId,
        page: page - 1,
        limit,
        search: searchQuery,
      },
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    magazineId
      ? [
          "magazine-articles",
          adminData.token,
          magazineId,
          page,
          limit,
          searchQuery,
        ]
      : null,
    fetchArticles,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load articles", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const articles = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (article: MagazineArticle) => {
    setViewingArticle(article);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (article?: MagazineArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({
        title: article.title,
        author: article.author,
        content: article.content || "",
        imageUrl: article.imageUrl || "",
        isPublished: article.isPublished,
      });
      setImagePreview(article.imageUrl || "");
      setImageFile(null);
    } else {
      setEditingArticle(null);
      setFormData({
        title: "",
        author: "",
        content: "",
        imageUrl: "",
        isPublished: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingArticle(null);
    setFormData({
      title: "",
      author: "",
      content: "",
      imageUrl: "",
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
    formData.append("folder", "soshsa/magazine-articles");

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
        ...formData,
        imageUrl: imageUrl || undefined,
        magazine: magazineId,
      };

      const actionText = editingArticle ? "Updating" : "Creating";
      toast.loading(`${actionText} article...`, { id: "action-toast" });

      if (editingArticle) {
        await axios.patch(
          `${BASE_URL}/magazine-articles/${editingArticle.id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${adminData.token}` },
          },
        );
        toast.dismiss("action-toast");
        toast.success("Article updated successfully");
      } else {
        await axios.post(`${BASE_URL}/magazine-articles`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Article created successfully");
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
        editingArticle
          ? "Failed to update article"
          : "Failed to create article",
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
      await axios.delete(`${BASE_URL}/magazine-articles/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.success("Article deleted successfully");
      mutate();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete article", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<MagazineArticle>[] = [
    {
      key: "imageUrl",
      label: "Image",
      render: (value) => (
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
          {value ? (
            <Image
              src={value as string}
              alt="Article"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Upload size={20} />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "author",
      label: "Author",
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
      <DashboardLayout pageTitle="Magazine Articles" adminData={adminData}>
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/admin/magazines")}
              leftIcon={<ArrowLeft size={20} />}
            >
              Back to Magazines
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search articles..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

            <Button
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Article
            </Button>
          </div>

          <Table
            columns={columns}
            data={articles}
            loading={isLoading}
            emptyMessage="No articles found"
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
          title="Article Details"
        >
          {viewingArticle && (
            <div className="space-y-6">
              {viewingArticle.imageUrl && (
                <div className="w-full aspect-video rounded-lg bg-gray-200 relative overflow-hidden">
                  <Image
                    src={viewingArticle.imageUrl}
                    alt={viewingArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {viewingArticle.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Author
                  </label>
                  <p className="text-gray-900">{viewingArticle.author}</p>
                </div>

                {viewingArticle.content && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Content
                    </label>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {viewingArticle.content}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderPublishedBadge(viewingArticle.isPublished)}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingArticle);
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
          title={editingArticle ? "Edit Article" : "Add Article"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Image (Optional)
              </label>
              <div className="flex items-start gap-6">
                {imagePreview ? (
                  <div className="w-48 h-32 rounded-lg overflow-hidden bg-gray-200 relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-48 h-32 rounded-lg bg-gray-100 flex items-center justify-center">
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
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 1200x800px
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Article Title"
              type="text"
              placeholder="Enter article title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <Input
              label="Author"
              type="text"
              placeholder="Enter author name"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />

            <Textarea
              label="Content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={8}
              placeholder="Article content..."
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
                  : editingArticle
                    ? "Update Article"
                    : "Add Article"}
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
          title="Delete Article"
          message="Are you sure you want to delete this article? This action cannot be undone."
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

export default MagazineArticlesPage;
