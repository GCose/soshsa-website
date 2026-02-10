import { useState } from "react";
import { Check, X } from "lucide-react";
// import { GetServerSideProps } from "next";
import Table from "@/components/dashboard/ui/Table";
import Sheet from "@/components/dashboard/ui/Sheet";
import { renderApprovedBadge } from "@/utils/badge";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { TableColumn, Comment } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockComments: Comment[] = [
  {
    id: "1",
    author: "Fatou Sanneh",
    email: "fatou@example.com",
    content: "Great article! Very insightful analysis on the topic...",
    articleTitle: "Issue 12 - Understanding Social Dynamics",
    isApproved: false,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    author: "Lamin Bah",
    email: "lamin@example.com",
    content: "I disagree with some of the points made here...",
    articleTitle: "Issue 12 - Economic Perspectives",
    isApproved: false,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    author: "Mariama Drammeh",
    email: "mariama@example.com",
    content: "Excellent research methodology used in this piece.",
    articleTitle: "Issue 11 - Research Methods",
    isApproved: true,
    createdAt: "2024-01-13",
  },
];

type FilterStatus = "all" | "pending" | "approved";

const CommentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pending");
  const [comments, setComments] = useState(mockComments);
  const [viewSheetOpen, setViewSheetOpen] = useState(false);
  const [viewingComment, setViewingComment] = useState<Comment | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.articleTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && !comment.isApproved) ||
      (filterStatus === "approved" && comment.isApproved);

    return matchesSearch && matchesFilter;
  });

  const handleView = (comment: Comment) => {
    setViewingComment(comment);
    setViewSheetOpen(true);
  };

  const handleApprove = (id: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, isApproved: true } : comment,
      ),
    );
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter((comment) => comment.id !== id));
    setDeleteModal({ isOpen: false, id: null });
  };

  const columns: TableColumn<Comment>[] = [
    {
      key: "author",
      label: "Author",
      render: (value: string | boolean) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "content",
      label: "Comment",
      render: (value: string | boolean) => (
        <span className="text-gray-700 truncate max-w-xs block">{value}</span>
      ),
    },
    {
      key: "articleTitle",
      label: "Article",
      render: (value: string | boolean) => (
        <span className="text-sm text-gray-600">{value}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value: string | boolean) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    {
      key: "isApproved",
      label: "Status",
      render: (value: string | boolean) =>
        renderApprovedBadge(value as boolean),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean, row) => (
        <div className="flex items-center gap-2">
          {!row.isApproved && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(value as string);
              }}
              className="cursor-pointer p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Approve"
            >
              <Check size={16} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal({ isOpen: true, id: value as string });
            }}
            className="cursor-pointer p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <X size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle="Comments">
      <div className="space-y-10">
        <div className="flex flex-col justify-between sm:flex-row gap-4">
          <SearchBar
            placeholder="Search comments..."
            onSearch={setSearchQuery}
            className="flex-1 max-w-md"
          />

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
              onClick={() => setFilterStatus("pending")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "pending"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("approved")}
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === "approved"
                  ? "bg-primary text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Approved
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredComments}
          emptyMessage="No comments found"
          onRowClick={handleView}
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
                  {viewingComment.author}
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
                <p className="text-gray-900">{viewingComment.content}</p>
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
                <button
                  onClick={() => {
                    handleApprove(viewingComment.id);
                    setViewSheetOpen(false);
                  }}
                  className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  Approve
                </button>
              )}
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

export default CommentsPage;
