import useSWR from "swr";
import {
  Council,
  TableColumn,
  CouncilsResponse,
  DashboardPageProps,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { BASE_URL } from "@/utils/url";
import { useRouter } from "next/router";
import { Toaster, toast } from "sonner";
import axios, { AxiosError } from "axios";
import { isLoggedIn } from "@/utils/auth";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import { renderStatusBadge } from "@/utils/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import Input from "@/components/dashboard/ui/InputField";
import { CustomError, ErrorResponseData } from "@/types";
import Textarea from "@/components/dashboard/ui/TextArea";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const CouncilsPage = ({ adminData }: DashboardPageProps) => {
  const [editingCouncil, setEditingCouncil] = useState<Council | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: false,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchCouncils = async (): Promise<CouncilsResponse> => {
    const { data } = await axios.get(`${BASE_URL}/councils`, {
      params: { page: page - 1, limit, search: searchQuery },
      headers: { Authorization: `Bearer ${adminData.token}` },
    });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["councils", adminData.token, page, limit, searchQuery],
    fetchCouncils,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load councils", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const councils = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleViewCouncil = (council: Council) => {
    router.push(`/admin/councils/${council.id}`);
  };

  const handleOpenSheet = (council?: Council) => {
    if (council) {
      setEditingCouncil(council);
      setFormData({
        name: council.name,
        description: council.description,
        isActive: council.isActive,
      });
    } else {
      setEditingCouncil(null);
      setFormData({ name: "", description: "", isActive: false });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingCouncil(null);
    setFormData({ name: "", description: "", isActive: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCouncil) {
        await axios.patch(
          `${BASE_URL}/councils/${editingCouncil.id}`,
          formData,
          { headers: { Authorization: `Bearer ${adminData.token}` } },
        );
        toast.success("Council updated successfully");
      } else {
        await axios.post(`${BASE_URL}/councils`, formData, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.success("Council created successfully");
      }
      mutate();
      handleCloseSheet();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error(
        editingCouncil
          ? "Failed to update council"
          : "Failed to create council",
        {
          description: message,
          duration: 4000,
        },
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/councils/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.success("Council deleted successfully");
      mutate();
    } catch (error) {
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete council", {
        description: message,
        duration: 4000,
      });
    }
  };

  const columns: TableColumn<Council>[] = [
    {
      key: "name",
      label: "Council Name",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    {
      key: "description",
      label: "Description",
      render: (value) => (
        <span className="line-clamp-2">{value as string}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => renderStatusBadge(value as boolean),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
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
      <DashboardLayout pageTitle="Councils" adminData={adminData}>
        <div className="space-y-10">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search councils..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />

            <Button
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Council
            </Button>
          </div>

          <Table
            data={councils}
            columns={columns}
            loading={isLoading}
            emptyMessage="No councils found"
            onRowClick={handleViewCouncil}
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
          onClose={handleCloseSheet}
          title={editingCouncil ? "Edit Council" : "Add Council"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Council Name"
              type="text"
              placeholder="e.g., 21st Executive Members"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <div>
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Describe this council..."
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-700"
              >
                Active council
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting}
              >
                {editingCouncil ? "Update Council" : "Add Council"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={submitting}
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
          title="Delete Council"
          message="Are you sure you want to delete this council? This action cannot be undone."
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

export default CouncilsPage;
