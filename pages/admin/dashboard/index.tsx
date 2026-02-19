import useSWR from "swr";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { NextApiRequest } from "next";
import { BASE_URL } from "@/utils/url";
import { isLoggedIn } from "@/utils/auth";
import axios, { AxiosError } from "axios";
import { getErrorMessage } from "@/utils/error";
import Table from "@/components/dashboard/ui/Table";
import {
  TableColumn,
  InboxMessage,
  DashboardStats,
  DashboardPageProps,
} from "@/types/interface/dashboard";
import { CustomError, ErrorResponseData } from "@/types";
import StatsCard from "@/components/dashboard/ui/StatsCard";
import { BookOpen, Book, Newspaper, Calendar } from "lucide-react";
import DashboardLayout from "@/components/dashboard/layout/DashboardLayout";
import DashboardSkeleton from "@/components/dashboard/skeletons/DashboardPageSkeleton";

const fetchStats = async (token: string): Promise<DashboardStats> => {
  const { data } = await axios.get(`${BASE_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data;
};

const fetchRecentInbox = async (token: string): Promise<InboxMessage[]> => {
  const { data } = await axios.get(`${BASE_URL}/inbox?page=0&limit=10`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data.data;
};

const statusColors = {
  unread: "bg-yellow-100 text-yellow-700 border-none",
  read: "bg-blue-100 text-blue-700 border-none",
  resolved: "bg-green-100 text-green-700 border-none",
};

const statusLabels: Record<InboxMessage["status"], string> = {
  unread: "Unread",
  read: "Read",
  resolved: "Resolved",
};

const DashboardPage = ({ adminData }: DashboardPageProps) => {
  const { data: stats, isLoading: statsLoading } = useSWR(
    ["dashboard-stats", adminData.token],
    () => fetchStats(adminData.token),
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load stats", {
          description: message,
          duration: 4000,
        });
      },
    },
  );

  const { data: recentSubmissions, isLoading: inboxLoading } = useSWR(
    ["dashboard-inbox", adminData.token],
    () => fetchRecentInbox(adminData.token),
    {
      revalidateOnFocus: false,
      onError: (error) => {
        const { message } = getErrorMessage(
          error as AxiosError<ErrorResponseData> | CustomError | Error,
        );
        toast.error("Failed to load recent submissions", {
          description: message,
        });
      },
    },
  );

  const isLoading = statsLoading || inboxLoading;

  const columns: TableColumn<InboxMessage>[] = [
    {
      key: "fullName",
      label: "Name",
      render: (value) => <span className="font-medium">{value as string}</span>,
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
          month: "2-digit",
          day: "2-digit",
          timeZone: "UTC",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs font-medium rounded border ${
            statusColors[value as InboxMessage["status"]]
          }`}
        >
          {statusLabels[value as InboxMessage["status"]]}
        </span>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" richColors />
      <DashboardLayout pageTitle="Dashboard" adminData={adminData}>
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-15">
              <StatsCard
                title="Total Events"
                value={stats?.totalEvents ?? 0}
                icon={<Calendar size={24} />}
              />
              <StatsCard
                title="News Articles"
                value={stats?.totalNews ?? 0}
                icon={<Newspaper size={24} />}
              />
              <StatsCard
                title="Magazine Issues"
                value={stats?.totalMagazines ?? 0}
                icon={<BookOpen size={24} />}
              />
              <StatsCard
                title="Total Courses"
                value={stats?.totalCourses ?? 0}
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
                data={recentSubmissions ?? []}
                emptyMessage="No contact submissions yet"
              />
            </div>
          </>
        )}
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

export default DashboardPage;
