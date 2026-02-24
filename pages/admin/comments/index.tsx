import useSWR from "swr";
import { NextApiRequest } from "next";
import { BASE_URL } from "@/utils/url";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import useDebounce from "@/utils/debounce";
import { Check, Trash2 } from "lucide-react";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import { renderApprovedBadge } from "@/utils/badge";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import Button from "@/components/dashboard/ui/Button";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import { CommentFilterStatus, CustomError, ErrorResponseData } from "@/types";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";
import { TableColumn, DashboardPageProps, CommentsResponse, MagazineComment } from "@/types/interface/dashboard";

const CommentsPage = ({ adminData }: DashboardPageProps) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [filterStatus, setFilterStatus] =
    useState<CommentFilterStatus>("pending");
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewingComment, setViewingComment] = useState<MagazineComment | null>(
    null,
  );
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });
  const limit = 15;

  const fetchComments = async (): Promise<CommentsResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (filterStatus === "pending") params.isApproved = "false";
    if (filterStatus === "approved") params.isApproved = "true";

    const { data } = await axios.get(`${BASE_URL}/magazine-article-comments`, {
      params,
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["magazine-comments", adminData.token, page, debouncedSearch, filterStatus],
    fetchComments,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load comments", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const comments = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleView = (comment: MagazineComment) => {
    setViewingComment(comment);
    setViewSheetOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      toast.loading("Approving comment...", { id: "approve-toast" });
      await axios.patch(
        `${BASE_URL}/magazine-article-comments/${id}`,
        { isApproved: true },
        {
          headers: { Authorization: `Bearer ${adminData.token}` },
        },
      );
      toast.dismiss("approve-toast");
      toast.success("Comment approved successfully");
      mutate();
    } catch (error) {
      toast.dismiss("approve-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to approve comment", {
        description: message,
        duration: 4000,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting comment...", { id: "delete-toast" });
      await axios.delete(`${BASE_URL}/magazine-article-comments/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.dismiss("delete-toast");
      toast.success("Comment deleted successfully");
      mutate();
      setDeleteModal({ isOpen: false, id: null });
    } catch (error) {
      toast.dismiss("delete-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete comment", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<MagazineComment>[] = [
    {
      key: "fullName",
      label: "Author",
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: "comment",
      label: "Comment",
      render: (value) => (
        <span className="truncate max-w-xs block">{value as string}</span>
      ),
    },
    {
      key: "articleTitle",
      label: "Article",
      render: (value) => <span>{value as string}</span>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    {
      key: "isApproved",
      label: "Status",
      render: (value) => renderApprovedBadge(value as boolean),
    },
    {
      key: "id",
      label: "Actions",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          {!row.isApproved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(row.id);
              }}
              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Approve"
            >
              <Check size={16} />
            </button>
          )}
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
      <DashboardLayout pageTitle="Magazine Comments" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col justify-between sm:flex-row gap-4">
            <SearchBar
              placeholder="Search comments..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

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
                variant={filterStatus === "pending" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("pending");
                  setPage(1);
                }}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "approved" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("approved");
                  setPage(1);
                }}
              >
                Approved
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            data={comments}
            loading={isLoading}
            emptyMessage="No comments found"
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
          title="Comment Details"
        >
          {viewingComment && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Author
                  </label>
                  <p className="text-gray-900 font-medium">
                    {viewingComment.fullName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{viewingComment.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Article
                  </label>
                  <p className="text-gray-900">{viewingComment.articleTitle}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Comment
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {viewingComment.comment}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Status
                  </label>
                  {renderApprovedBadge(viewingComment.isApproved)}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {new Date(viewingComment.createdAt).toLocaleDateString(
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
                {!viewingComment.isApproved && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => {
                      handleApprove(viewingComment.id);
                      setViewSheetOpen(false);
                    }}
                  >
                    Approve
                  </Button>
                )}
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

        <ConfirmationModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: null })}
          onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
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

export default CommentsPage;
