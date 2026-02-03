import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import { TableColumn } from "@/types/interface/dashboard";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "Unread" | "Read" | "Resolved";
  createdAt: string;
}

const mockSubmissions: ContactSubmission[] = [
  {
    id: "1",
    name: "Fatou Sanneh",
    email: "fatou.sanneh@example.com",
    phone: "+220 7890123",
    subject: "Inquiry about Events",
    message:
      "Hello, I would like to know more about the upcoming events for this semester. Are there any workshops planned for psychology students?",
    status: "Unread",
    createdAt: "2024-01-15T10:30:00",
  },
  {
    id: "2",
    name: "Lamin Ceesay",
    email: "lamin.ceesay@example.com",
    phone: "+220 3456789",
    subject: "Magazine Submission",
    message:
      "I have an article I would like to submit for the next magazine issue. How can I go about this?",
    status: "Read",
    createdAt: "2024-01-14T14:20:00",
  },
  {
    id: "3",
    name: "Mariama Jallow",
    email: "mariama.jallow@example.com",
    phone: "+220 9876543",
    subject: "Membership Question",
    message:
      "How do I become a member of SoSHSA? What are the requirements and benefits?",
    status: "Resolved",
    createdAt: "2024-01-13T09:15:00",
  },
  {
    id: "4",
    name: "Ousman Bah",
    email: "ousman.bah@example.com",
    phone: "+220 2345678",
    subject: "Course Brochure Request",
    message:
      "Can you provide the course brochure for Sociology 201? The link on the website is not working.",
    status: "Unread",
    createdAt: "2024-01-12T16:45:00",
  },
];

type FilterStatus = "all" | "unread" | "read" | "resolved";

const ContactPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewingSubmission, setViewingSubmission] =
    useState<ContactSubmission | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      submission.status.toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleView = (submission: ContactSubmission) => {
    setViewingSubmission(submission);
    setSheetOpen(true);
    if (submission.status === "Unread") {
      setSubmissions(
        submissions.map((s) =>
          s.id === submission.id ? { ...s, status: "Read" as const } : s,
        ),
      );
    }
  };

  const handleMarkAsResolved = (id: string) => {
    setSubmissions(
      submissions.map((s) =>
        s.id === id ? { ...s, status: "Resolved" as const } : s,
      ),
    );
    setSheetOpen(false);
  };

  const handleDelete = (id: string) => {
    setSubmissions(submissions.filter((s) => s.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const renderStatusBadge = (status: string) => {
    const colors = {
      Unread: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Read: "bg-blue-100 text-blue-700 border-blue-300",
      Resolved: "bg-green-100 text-green-700 border-green-300",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
          colors[status as keyof typeof colors]
        }`}
      >
        {status}
      </span>
    );
  };

  const columns: TableColumn<ContactSubmission>[] = [
    {
      key: "name",
      label: "Name",
      render: (value: string | boolean | number) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string | boolean | number) => (
        <span className="text-gray-700">{value}</span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (value: string | boolean | number) => (
        <span className="text-gray-900">{value}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string | boolean | number) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string | boolean | number) =>
        renderStatusBadge(value as string),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean | number, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleView(row)}
            className="cursor-pointer p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() =>
              setDeleteModal({ isOpen: true, id: value as string })
            }
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
    <DashboardLayout pageTitle="Contact Inbox">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            onSearch={setSearchQuery}
            className="flex-1 max-w-md"
            placeholder="Search by name, email, or subject..."
          />
        </div>

        <div className="flex flex-col items-center sm:flex-row gap-4">
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
              onClick={() => setFilterStatus("unread")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "unread"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterStatus("read")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "read"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "resolved"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredSubmissions}
          emptyMessage="No contact submissions found"
        />
      </div>

      <Sheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Contact Submission"
      >
        {viewingSubmission && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Name
                </label>
                <p className="text-gray-900 font-medium">
                  {viewingSubmission.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{viewingSubmission.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <p className="text-gray-900">{viewingSubmission.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Subject
                </label>
                <p className="text-gray-900 font-medium">
                  {viewingSubmission.subject}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Message
                </label>
                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {viewingSubmission.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Status
                </label>
                {renderStatusBadge(viewingSubmission.status)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Received
                </label>
                <p className="text-gray-900">
                  {new Date(viewingSubmission.createdAt).toLocaleString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {viewingSubmission.status !== "Resolved" && (
                <button
                  onClick={() => handleMarkAsResolved(viewingSubmission.id)}
                  className="cursor-pointer flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
              <button
                onClick={() => setSheetOpen(false)}
                className="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        title="Delete Submission"
        message="Are you sure you want to delete this contact submission? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </DashboardLayout>
  );
};

export default ContactPage;
