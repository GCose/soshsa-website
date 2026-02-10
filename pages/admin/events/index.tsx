import { useState } from "react";
import Image from "next/image";
// import { GetServerSideProps } from "next";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { TableColumn, Event } from "@/types/interface/dashboard";
import { Plus, Edit, Trash2, Star, Upload } from "lucide-react";
import { renderPublishedBadge, renderTypeBadge } from "@/utils/badge";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Book Fair 2024",
    date: "2024-02-15",
    location: "UTG Main Campus",
    type: "Workshop",
    image: "/images/home/event-1.jpg",
    isPublished: true,
    isFeatured: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Research Methodology Seminar",
    date: "2024-02-20",
    location: "SICT Auditorium",
    type: "Seminar",
    image: "/images/home/event-2.jpg",
    isPublished: true,
    isFeatured: false,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Community Outreach Program",
    date: "2024-03-01",
    location: "Brikama Community Center",
    type: "Community Service",
    image: "/images/home/event-3.jpg",
    isPublished: false,
    isFeatured: false,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Career Development Workshop",
    date: "2024-03-10",
    location: "Online",
    type: "Workshop",
    image: "/images/home/event-2.jpg",
    isPublished: true,
    isFeatured: true,
    createdAt: "2024-01-12",
  },
];

type FilterStatus = "all" | "published" | "draft";

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [events, setEvents] = useState(mockEvents);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    location: "",
    description: "",
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

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "published" && event.isPublished) ||
      (filterStatus === "draft" && !event.isPublished);

    return matchesSearch && matchesFilter;
  });

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
        date: event.date,
        location: event.location,
        description: "",
        isFeatured: event.isFeatured,
        isPublished: event.isPublished,
      });
      setImagePreview(event.image);
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        type: "",
        date: "",
        location: "",
        description: "",
        isFeatured: false,
        isPublished: true,
      });
      setImagePreview("");
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingEvent(null);
    setImagePreview("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const columns: TableColumn<Event>[] = [
    {
      key: "image",
      label: "Image",
      render: (value: string | boolean | undefined, row) => (
        <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 relative">
          <Image
            src={value as string}
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
      render: (value: string | boolean | undefined, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{value}</span>
          {row.isFeatured && (
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
          )}
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (value: string | boolean | undefined) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
    },
    {
      key: "location",
      label: "Location",
    },
    {
      key: "type",
      label: "Type",
      render: (value: string | boolean | undefined) =>
        renderTypeBadge(value as string),
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value: string | boolean | undefined) =>
        renderPublishedBadge(value as boolean),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_value: string | boolean | undefined, row) => (
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
    <DashboardLayout pageTitle="Events">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            placeholder="Search events..."
            onSearch={setSearchQuery}
            className="flex-1 max-w-md"
          />

          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Event
          </button>
        </div>

        <div className="flex flex-col items-center sm:flex-row gap-4 mt-10">
          <div>
            <h1>Filters:</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "published"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "draft"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Draft
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredEvents}
          emptyMessage="No events found"
          onRowClick={handleView}
        />
      </div>

      <Sheet
        isOpen={viewSheetOpen}
        onClose={() => setViewSheetOpen(false)}
        title="Event Details"
      >
        {viewingEvent && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-full h-screen aspect-video rounded-sm  bg-gray-200 relative">
                <Image
                  src={viewingEvent.image}
                  alt={viewingEvent.title}
                  fill
                  className="object-cover"
                />
              </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                {renderPublishedBadge(viewingEvent.isPublished)}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setViewSheetOpen(false);
                  handleOpenSheet(viewingEvent);
                }}
                className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setViewSheetOpen(false)}
                className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
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
              Event Image
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
                  Upload Image
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
              Event Type
              <span className="text-red-500 ml-1">*</span>
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
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter event description..."
            />
          </div>

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
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingEvent ? "Update Event" : "Add Event"}
            </button>
            <button
              type="button"
              onClick={handleCloseSheet}
              className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
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
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const token = context.req.cookies.token || null;

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/admin/auth/sign-in",
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default EventsPage;
