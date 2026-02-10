import { ContactSubmission } from "@/types";
import Table from "@/components/dashboard/ui/Table";
import { TableColumn } from "@/types/interface/dashboard";
import StatsCard from "@/components/dashboard/ui/StatsCard";
import { Calendar, BookOpen, Book } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import Link from "next/link";

const mockStats = {
  totalEvents: 12,
  totalNews: 24,
  totalMagazines: 8,
  totalCourses: 15,
};

const mockRecentSubmissions: ContactSubmission[] = [
  {
    id: "1",
    name: "Fatou Sanneh",
    email: "fatou@example.com",
    subject: "Partnership Inquiry",
    date: "2024-01-15",
    status: "Unread",
  },
  {
    id: "2",
    name: "Lamin Bah",
    email: "lamin@example.com",
    subject: "Event Registration",
    date: "2024-01-14",
    status: "Read",
  },
  {
    id: "3",
    name: "Mariama Drammeh",
    email: "mariama@example.com",
    subject: "Magazine Submission",
    date: "2024-01-13",
    status: "Resolved",
  },
  {
    id: "4",
    name: "Ebrima Jallow",
    email: "ebrima.jallow@example.com",
    subject: "Volunteer Application",
    date: "2024-01-12",
    status: "Unread",
  },
  {
    id: "5",
    name: "Awa Touray",
    email: "awa.touray@example.com",
    subject: "Membership Information",
    date: "2024-01-11",
    status: "Read",
  },
  {
    id: "6",
    name: "Momodou Ceesay",
    email: "momodou.ceesay@example.com",
    subject: "Event Sponsorship",
    date: "2024-01-10",
    status: "Resolved",
  },
  {
    id: "7",
    name: "Binta Sowe",
    email: "binta.sowe@example.com",
    subject: "Website Feedback",
    date: "2024-01-09",
    status: "Read",
  },
  {
    id: "8",
    name: "Yankuba Darboe",
    email: "yankuba.darboe@example.com",
    subject: "Training Program Inquiry",
    date: "2024-01-08",
    status: "Unread",
  },
  {
    id: "9",
    name: "Khadija Njie",
    email: "khadija.njie@example.com",
    subject: "Magazine Advertisement",
    date: "2024-01-07",
    status: "Resolved",
  },
  {
    id: "10",
    name: "Ousman Manneh",
    email: "ousman.manneh@example.com",
    subject: "General Inquiry",
    date: "2024-01-06",
    status: "Read",
  },
];

const DashboardPage = () => {
  const columns: TableColumn<ContactSubmission>[] = [
    {
      key: "name",
      label: "Name",
      render: (value: string) => <span className="font-medium">{value}</span>,
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
      key: "date",
      label: "Date",
      render: (value) =>
        new Date(value).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const colors = {
          Unread: "bg-yellow-100 text-yellow-700 border-yellow-300",
          Read: "bg-blue-100 text-blue-700 border-blue-300",
          Resolved: "bg-green-100 text-green-700 border-green-300",
        };
        return (
          <span
            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
              colors[value as keyof typeof colors]
            }`}
          >
            {value}
          </span>
        );
      },
    },
  ];

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-15">
        <StatsCard
          title="Total Events"
          value={mockStats.totalEvents}
          icon={<Calendar size={24} />}
        />
        <StatsCard
          title="News Articles"
          value={mockStats.totalNews}
          icon={<BookOpen size={24} />}
        />
        <StatsCard
          title="Magazine Issues"
          value={mockStats.totalMagazines}
          icon={<BookOpen size={24} />}
        />
        <StatsCard
          title="Total Courses"
          value={mockStats.totalCourses}
          icon={<Book size={24} />}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[clamp(1rem,2vw,1.4rem)] font-bold text-gray-900">
            Recent Contact Submissions
          </h2>
          <Link
            href="/admin/inbox"
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
          >
            View All →
          </Link>
        </div>
        <Table
          columns={columns}
          data={mockRecentSubmissions}
          emptyMessage="No contact submissions yet"
          onRowClick={(row) => console.log("Clicked:", row)}
        />
      </div>
    </DashboardLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   // Check authentication
//   const token = context.req.cookies.token || null;

//   if (!token) {
//     return {
//       redirect: {
//         destination: "/admin/login",
//         permanent: false,
//       },
//     };
//   }

//   // Verify token with backend
//   // const isValid = await verifyToken(token)
//   // if (!isValid) {
//   //   return {
//   //     redirect: {
//   //       destination: "/admin/login",
//   //       permanent: false,
//   //     },
//   //   }
//   // }

//   return {
//     props: {},
//   };
// };

export default DashboardPage;
