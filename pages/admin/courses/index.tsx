import { useState } from "react";
// import { GetServerSideProps } from "next";=
import { renderStatusBadge } from "@/utils/badge";
import Sheet from "@/components/dashboard/ui/Sheet";
import Table from "@/components/dashboard/ui/Table";
import Input from "@/components/dashboard/ui/InputField";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, Download, Upload } from "lucide-react";
import { Course, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import ConfirmationModal from "@/components/dashboard/ui/modals/ConfirmationModal";

const mockCourses: Course[] = [
  {
    id: "1",
    code: "SOC101",
    title: "Introduction to Sociology",
    department: "Sociology",
    year: 1,
    creditHours: 3,
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    code: "PSY102",
    title: "General Psychology",
    department: "Psychology",
    year: 1,
    creditHours: 3,
    isActive: true,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    code: "HIS201",
    title: "African History",
    department: "History",
    year: 2,
    creditHours: 4,
    isActive: true,
    createdAt: "2024-01-13",
  },
];

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(mockCourses);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    department: "",
    year: 1,
    creditHours: 3,
    isActive: true,
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({
    isOpen: false,
    id: null,
  });

  const filteredCourses = courses.filter(
    (course) =>
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenSheet = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        code: course.code,
        title: course.title,
        department: course.department,
        year: course.year,
        creditHours: course.creditHours,
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
        isActive: true,
      });
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingCourse(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleCloseSheet();
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const columns: TableColumn<Course>[] = [
    {
      key: "code",
      label: "Code",
      render: (value: string | boolean | number) => (
        <span className="font-medium text-gray-900">{value}</span>
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
      render: (value: string | boolean | number) => <span>Year {value}</span>,
    },
    {
      key: "creditHours",
      label: "Credits",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: string | boolean | number) =>
        renderStatusBadge(value as boolean),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean | number) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log("Download brochure for", value)}
            className="cursor-pointer p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Download Brochure"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => {
              const course = courses.find((c) => c.id === value);
              if (course) handleOpenSheet(course);
            }}
            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
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
    <DashboardLayout pageTitle="Courses">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search courses..."
          />
          <button
            onClick={() => handleOpenSheet()}
            className="cursor-pointer flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Course
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredCourses}
          emptyMessage="No courses found"
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
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
              className="hidden"
              id="brochure-upload"
            />
            <label
              htmlFor="brochure-upload"
              className="cursor-pointer inline-flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              Upload Brochure
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF file. Max 10MB.</p>
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
              Active (show to students)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              {editingCourse ? "Update Course" : "Add Course"}
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
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
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

export default CoursesPage;
