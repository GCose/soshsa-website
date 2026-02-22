import {
  FilterYear,
  CustomError,
  ErrorResponseData,
  CourseFilterStatus,
} from "@/types";
import useSWR from "swr";
import {
  Course,
  TableColumn,
  CoursesResponse,
  DashboardPageProps,
} from "@/types/interface/dashboard";
import { NextApiRequest } from "next";
import { Toaster, toast } from "sonner";
import { isLoggedIn } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/error";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Button from "@/components/dashboard/ui/Button";
import { BASE_URL, JEETIX_BASE_URL } from "@/utils/url";
import Input from "@/components/dashboard/ui/InputField";
import { Edit, Plus, Trash2, Upload } from "lucide-react";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const CoursesPage = ({ adminData }: DashboardPageProps) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState<FilterYear>("all");
  const [filterStatus, setFilterStatus] = useState<CourseFilterStatus>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    department: "",
    year: 1,
    creditHours: 3,
    brochureUrl: "",
    isActive: true,
  });
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const fetchCourses = async (): Promise<CoursesResponse> => {
    const params: Record<string, string | number> = {
      page: page - 1,
      limit,
      department: searchQuery,
    };

    if (filterYear !== "all") params.year = filterYear;
    if (filterStatus !== "all") params.isActive = filterStatus;

    const { data } = await axios.get(`${BASE_URL}/courses`, { params });
    return data.data;
  };

  const { data, mutate, isLoading } = useSWR(
    ["courses", page, limit, searchQuery, filterYear, filterStatus],
    fetchCourses,
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load courses", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const courses = data?.data ?? [];
  const totalPages = data ? Math.ceil(data.meta.total / limit) : 0;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleOpenSheet = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        title: course.title,
        department: course.department,
        year: course.year,
        creditHours: course.creditHours,
        brochureUrl: course.brochureUrl || "",
        isActive: course.isActive,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        code: "",
        title: "",
        department: "",
        year: 1,
        creditHours: 3,
        brochureUrl: "",
        isActive: true,
      });
    }
    setBrochureFile(null);
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingCourse(null);
    setBrochureFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setBrochureFile(file);
    } else {
      toast.error("Please select a valid PDF file");
    }
  };

  const uploadFileToJeetix = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "soshsa/courses");

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
      let brochureUrl = formData.brochureUrl;

      if (brochureFile) {
        setUploadingFile(true);
        toast.loading("Uploading brochure...", { id: "upload-toast" });
        brochureUrl = await uploadFileToJeetix(brochureFile);
        toast.dismiss("upload-toast");
        setUploadingFile(false);
      }

      const payload = {
        ...formData,
        brochureUrl: brochureUrl || undefined,
      };

      const actionText = editingCourse ? "Updating" : "Creating";
      toast.loading(`${actionText} course...`, { id: "action-toast" });

      if (editingCourse) {
        await axios.patch(`${BASE_URL}/courses/${editingCourse.id}`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Course updated successfully");
      } else {
        await axios.post(`${BASE_URL}/courses`, payload, {
          headers: { Authorization: `Bearer ${adminData.token}` },
        });
        toast.dismiss("action-toast");
        toast.success("Course created successfully");
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
        editingCourse ? "Failed to update course" : "Failed to create course",
        {
          description: message,
          duration: 4000,
        },
      );
    } finally {
      setSubmitting(false);
      setUploadingFile(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting course...", { id: "delete-toast" });
      await axios.delete(`${BASE_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${adminData.token}` },
      });
      toast.dismiss("delete-toast");
      toast.success("Course deleted successfully");
      mutate();
    } catch (error) {
      toast.dismiss("delete-toast");
      const { message } = getErrorMessage(
        error as AxiosError<ErrorResponseData> | CustomError | Error,
      );
      toast.error("Failed to delete course", {
        description: message,
        duration: 4000,
      });
    }
  };

  const renderStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
          isActive
            ? "bg-green-100 text-green-700 border-green-300"
            : "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const columns: TableColumn<Course>[] = [
    {
      key: "code",
      label: "Code",
      render: (value) => (
        <span className="font-medium text-gray-900">{value as string}</span>
      ),
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "department",
      label: "Department",
    },
    {
      key: "year",
      label: "Year",
      render: (value) => <span>Year {value}</span>,
    },
    {
      key: "creditHours",
      label: "Credits",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => renderStatusBadge(value as boolean),
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
      <DashboardLayout pageTitle="Course Brochures" adminData={adminData}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <SearchBar
              placeholder="Search by department..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />
            <Button
              variant="primary"
              onClick={() => handleOpenSheet()}
              leftIcon={<Plus size={20} />}
            >
              Add Course
            </Button>
          </div>

          <div className="flex flex-col items-center sm:flex-row gap-4 pt-6">
            <div>
              <h3 className="font-medium text-gray-900">Filters:</h3>
            </div>
            <div className="flex gap-2">
              <select
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value as FilterYear);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <option value="all">All Years</option>
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
                <option value={5}>Year 5</option>
              </select>

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
                variant={filterStatus === "true" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("true");
                  setPage(1);
                }}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === "false" ? "primary" : "secondary"}
                onClick={() => {
                  setFilterStatus("false");
                  setPage(1);
                }}
              >
                Inactive
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            data={courses}
            loading={isLoading}
            emptyMessage="No courses brochures found"
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
          title={editingCourse ? "Edit Course" : "Add Course"}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Course Code"
              type="text"
              placeholder="e.g., SOC101"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
              required
            />

            <Input
              label="Course Title"
              type="text"
              placeholder="Enter course title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />

            <Input
              label="Department"
              type="text"
              placeholder="e.g., Sociology, Psychology"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year"
                type="number"
                min="1"
                max="5"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                required
              />

              <Input
                label="Credit Hours"
                type="number"
                min="1"
                max="6"
                value={formData.creditHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    creditHours: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Brochure (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="brochure-upload"
              />
              <label
                htmlFor="brochure-upload"
                className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload size={16} />
                {brochureFile
                  ? brochureFile.name
                  : editingCourse && formData.brochureUrl
                    ? "Change Brochure"
                    : "Upload Brochure"}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PDF file (optional) - Course syllabus or details
              </p>
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
                Mark as active
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                isLoading={submitting || uploadingFile}
              >
                {uploadingFile
                  ? "Uploading..."
                  : editingCourse
                    ? "Update Course"
                    : "Add Course"}
              </Button>
              <Button
                type="button"
                variant="secondary"
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
          title="Delete Course"
          message="Are you sure you want to delete this course? This action cannot be undone."
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

export default CoursesPage;
