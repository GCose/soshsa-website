import { useState } from "react";
import { useRouter } from "next/router";
// import { GetServerSideProps } from "next";
import Table from "@/components/dashboard/ui/Table";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, Eye, Star } from "lucide-react";
import { TableColumn, Event } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Annual Book Fair 2024",
    date: "2024-02-15",
    location: "UTG Main Campus",
    type: "Workshop",
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
    isPublished: true,
    isFeatured: true,
    createdAt: "2024-01-12",
  },
];

type FilterStatus = "all" | "published" | "draft";

const EventsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [events, setEvents] = useState(mockEvents);

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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const columns: TableColumn<Event>[] = [
    {
      key: "title",
      label: "Event Title",
      render: (value: string | boolean, row) => (
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
      render: (value: string | boolean) =>
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
      render: (value: string | boolean) => (
        <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded border bg-blue-100 text-blue-700 border-blue-300">
          {value}
        </span>
      ),
    },
    {
      key: "isPublished",
      label: "Status",
      render: (value: string | boolean) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
            value
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-yellow-100 text-yellow-700 border-yellow-300"
          }`}
        >
          {value ? "Published" : "Draft"}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/events/${value}`)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => router.push(`/admin/events/${value}/edit`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(value as string)}
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
    <DashboardLayout pageTitle="Events">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            placeholder="Search events..."
            onSearch={setSearchQuery}
            className="flex-1 max-w-md"
          />

          <button
            onClick={() => router.push("/admin/events/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("published")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "published"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
        />
      </div>
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
