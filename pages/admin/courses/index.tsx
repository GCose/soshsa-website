import { useState } from "react";
// import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Table from "@/components/dashboard/ui/Table";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Plus, Edit, Trash2, Download } from "lucide-react";
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
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(mockCourses);
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
      render: (value: string | boolean | number) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
            value
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean | number) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => console.log("Download brochure for", value)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Download Brochure"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => router.push(`/admin/courses/${value}/edit`)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() =>
              setDeleteModal({ isOpen: true, id: value as string })
            }
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
    <DashboardLayout pageTitle="Courses">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            className="max-w-md"
            onSearch={setSearchQuery}
            placeholder="Search courses..."
          />
          <button
            onClick={() => router.push("/admin/courses/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
