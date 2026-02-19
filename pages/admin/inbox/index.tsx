import useSWR from "swr";
import {
  TableColumn,
  InboxMessage,
  InboxResponse,
  DashboardPageProps,
} from "@/types/interface/dashboard";
import { Trash2 } from "lucide-react";
import { NextApiRequest } from "next";
import { BASE_URL } from "@/utils/url";
import { Toaster, toast } from "sonner";
import { isLoggedIn } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { CustomError, ErrorResponseData, InboxFilterStatus } from "@/types";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const InboxPage = ({ adminData }: DashboardPageProps) => {
  const [filterStatus, setFilterStatus] = useState<InboxFilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [viewingMessage, setViewingMessage] = useState<InboxMessage | null>(
    null,
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchMessages = async (): Promise<InboxResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
      search: searchQuery,
    };

    if (filterStatus !== "all") params.status = filterStatus;

    const { data } = await axios.get(`${BASE_URL}/inbox`, {
      params,
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["inbox", adminData.token, page, limit, searchQuery, filterStatus],
    fetchMessages,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load messages", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const messages = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = async (message: InboxMessage) => {
    setViewingMessage(message);
    setSheetOpen(true);

    if (message.status === "unread") {
      try {
        await axios.patch(
          `${BASE_URL}/inbox/${message.id}/status`,
          { status: "read" },
          { headers: { Authorization: `Bearer ${adminData.token}` } },
        );
        mutate();
      } catch (error) {
        const { message: errMsg } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to mark as read", {
          description: errMsg,
          duration: 4000,
        });
      }
    }
  };

  const handleMarkAsResolved = async (id: string) => {
    try {
      await axios.patch(
        `${BASE_URL}/inbox/${id}/status`,
        { status: "resolved" },
        { headers: { Authorization: `Bearer ${adminData.token}` } },
      );
      toast.success("Message marked as resolved");
      mutate();
      setSheetOpen(false);
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to resolve message", {
        description: message,
        duration: 4000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/inbox/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.success("Message deleted successfully");
      mutate();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete message", {
        description: message,
        duration: 4000,
      });
    }
  };

  const renderStatusBadge = (status: InboxMessage["status"]) => {
    const colors = {
      unread: "bg-yellow-100 text-yellow-700 border-none",
      read: "bg-blue-100 text-blue-700 border-none",
      resolved: "bg-green-100 text-green-700 border-none",
    };
    const labels = {
      unread: "Unread",
      read: "Read",
      resolved: "Resolved",
    };
    return (
      <span
        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${colors[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const columns: TableColumn<InboxMessage>[] = [
    {
      key: "fullName",
      label: "Name",
      render: (value) => (
        <span className="font-medium">{value as string}</span>
      ),
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "subject",
      label: "Subject",
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => renderStatusBadge(value as InboxMessage["status"]),
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
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
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout pageTitle="Inbox" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search messages..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />
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
                variant={filterStatus === "unread" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("unread");
                  setPage(1);
                }}
              >
                Unread
              </Button>
              <Button
                variant={filterStatus === "read" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("read");
                  setPage(1);
                }}
              >
                Read
              </Button>
              <Button
                variant={filterStatus === "resolved" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("resolved");
                  setPage(1);
                }}
              >
                Resolved
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            data={messages}
            loading={isLoading}
            emptyMessage="No messages found"
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
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Message Details"
        >
          {viewingMessage && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {viewingMessage.fullName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{viewingMessage.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-900">{viewingMessage.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Subject
                  </label>
                  <p className="text-gray-900 font-medium">
                    {viewingMessage.subject}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Message
                  </label>
                  <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {viewingMessage.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderStatusBadge(viewingMessage.status)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Received
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewingMessage.createdAt).toLocaleString(
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
                {viewingMessage.status !== "resolved" && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleMarkAsResolved(viewingMessage.id)}
                  >
                    Mark as Resolved
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setSheetOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </Sheet>

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null })}
          onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
          title="Delete Message"
          message="Are you sure you want to delete this message? This action cannot be undone."
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

export default InboxPage;
