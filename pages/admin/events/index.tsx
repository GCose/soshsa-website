import useSWR from "swr";
import Image from "next/image";
import {
  Event,
  TableColumn,
  DashboardPageProps,
  EventsResponse,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import Input from "@/components/dashboard/ui/InputField";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Textarea from "@/components/dashboard/ui/TextArea";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, Star, Upload } from "lucide-react";
import { renderPublishedBadge, renderTypeBadge } from "@/utils/badge";
import { CustomError, ErrorResponseData, FilterStatus } from "@/types";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const EventsPage = ({ adminData }: DashboardPageProps) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
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
    type: "",
    date: "",
    location: "",
    description: "",
    imageUrl: "",
    isFeatured: false,
    isPublished: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchEvents = async (): Promise<EventsResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
      search: searchQuery,
    };

    if (filterStatus === "published") params.isPublished = "true";
    if (filterStatus === "draft") params.isPublished = "false";

    const { data } = await axios.get(`${BASE_URL}/events`, {
      params,
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["events", adminData.token, page, limit, searchQuery, filterStatus],
    fetchEvents,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load events", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const events = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (event: Event) => {
    setViewingEvent(event);
    setViewSheetOpen(true);
  };

  const handleOpenSheet = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        type: event.type,
        date: event.date.split("T")[0],
        location: event.location,
        description: event.description || "",
        imageUrl: event.imageUrl,
        isFeatured: event.isFeatured,
        isPublished: event.isPublished,
      });
      setImagePreview(event.imageUrl);
      setImageFile(null);
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        type: "",
        date: "",
        location: "",
        description: "",
        imageUrl: "",
        isFeatured: false,
        isPublished: true,
      });
      setImagePreview("");
      setImageFile(null);
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      type: "",
      date: "",
      location: "",
      description: "",
      imageUrl: "",
      isFeatured: false,
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
    formData.append("folder", "soshsa/events");

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

      if (!imageUrl) {
        toast.error("Event image is required");
        setSubmitting(false);
        return;
      }

      const payload = {
        ...formData,
        imageUrl,
        date: new Date(formData.date).toISOString(),
      };

      const actionText = editingEvent ? "Updating" : "Creating";
      toast.loading(`${actionText} event...`, { id: "action-toast" });

      if (editingEvent) {
        await axios.patch(`${BASE_URL}/events/${editingEvent.id}`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Event updated successfully");
      } else {
        await axios.post(`${BASE_URL}/events`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Event created successfully");
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
        editingEvent ? "Failed to update event" : "Failed to create event",
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
      await axios.delete(`${BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.success("Event deleted successfully");
      mutate();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete event", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<Event>[] = [
    {
      key: "imageUrl",
      label: "Image",
      render: (value, row) => (
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
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
      label: "Event Title",
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value as string}</span>
          {row.isFeatured && (
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (value) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "type",
      label: "Type",
      render: (value) => renderTypeBadge(value as string),
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
      <DashboardLayout pageTitle="Events" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search events..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

            <Button
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Event
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
            data={events}
            loading={isLoading}
            emptyMessage="No events found"
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
          title="Event Details"
        >
          {viewingEvent && (
            <div className="space-y-6">
              <div className="w-full aspect-video rounded-lg bg-gray-200 relative overflow-hidden">
                <Image
                  src={viewingEvent.imageUrl}
                  alt={viewingEvent.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Event Title
                  </label>
                  <p className="text-gray-900 font-medium text-lg">
                    {viewingEvent.title}
                    {viewingEvent.isFeatured && (
                      <Star
                        size={16}
                        className="inline ml-2 text-yellow-500 fill-yellow-500"
                      />
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Type
                  </label>
                  {renderTypeBadge(viewingEvent.type)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewingEvent.date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Location
                  </label>
                  <p className="text-gray-900">{viewingEvent.location}</p>
                </div>

                {viewingEvent.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900">{viewingEvent.description}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderPublishedBadge(viewingEvent.isPublished)}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setViewSheetOpen(false);
                    handleOpenSheet(viewingEvent);
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
          title={editingEvent ? "Edit Event" : "Add Event"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image <span className="text-red-500">*</span>
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
                    required={!editingEvent && !imagePreview}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Upload size={16} />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Recommended: 1920x1080px
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Event Title"
              type="text"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select event type</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Community Service">Community Service</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Event Date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <Input
              label="Location"
              type="text"
              placeholder="Enter event location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Enter event description..."
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-gray-700"
              >
                Featured Event
              </label>
            </div>

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
                  : editingEvent
                    ? "Update Event"
                    : "Add Event"}
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
          title="Delete Event"
          message="Are you sure you want to delete this event? This action cannot be undone."
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

export default EventsPage;
