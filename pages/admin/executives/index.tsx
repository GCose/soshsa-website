import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
// import { GetServerSideProps } from "next";
import { Plus, Edit, Trash2 } from "lucide-react";
import Table from "@/components/dashboard/ui/Table";
import SearchBar from "@/components/dashboard/ui/SearchBar";
import { Executive, TableColumn } from "@/types/interface/dashboard";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";

const mockExecutives: Executive[] = [
  {
    id: "1",
    name: "Fatou Sanneh",
    position: "President",
    image: "/images/about/exec-1.jpg",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Lamin Bah",
    position: "Vice President",
    image: "/images/about/exec-2.jpg",
    isActive: true,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    name: "Mariama Drammeh",
    position: "Secretary General",
    image: "/images/about/exec-3.jpg",
    isActive: true,
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Ebrima Jallow",
    position: "Treasurer",
    image: "/images/about/exec-4.jpg",
    isActive: true,
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Awa Touray",
    position: "Public Relations Officer",
    image: "/images/about/exec-5.jpg",
    isActive: false,
    createdAt: "2024-01-11",
  },
];

const ExecutivesPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [executives, setExecutives] = useState(mockExecutives);

  const filteredExecutives = executives.filter(
    (exec) =>
      exec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this executive?")) {
      setExecutives(executives.filter((exec) => exec.id !== id));
    }
  };

  const columns: TableColumn<Executive>[] = [
    {
      key: "image",
      label: "Photo",
      render: (value: string | boolean, row) => (
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative">
          <Image
            src={value as string}
            alt={row.name}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (value: string | boolean) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: "position",
      label: "Position",
    },
    {
      key: "isActive",
      label: "Status",
      render: (value: string | boolean) => (
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
      key: "createdAt",
      label: "Date Added",
      render: (value: string | boolean) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    {
      key: "id",
      label: "Actions",
      render: (value: string | boolean) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/admin/executives/${value}/edit`)}
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
    <DashboardLayout pageTitle="Executives">
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <SearchBar
            placeholder="Search by name or position..."
            onSearch={setSearchQuery}
            className="max-w-lg"
          />
          <button
            onClick={() => router.push("/admin/executives/create")}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Executive
          </button>
        </div>

        <Table
          columns={columns}
          data={filteredExecutives}
          emptyMessage="No executives found"
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

export default ExecutivesPage;
