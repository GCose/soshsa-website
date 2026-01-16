import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Mail,
  Menu,
  Users,
  LogOut,
  Calendar,
  BookOpen,
  Settings,
  MessageSquare,
  GraduationCap,
  LayoutDashboard,
  Link as LinkIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { DashboardLayoutProps } from "@/types/interface/dashboard";

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Executives", href: "/admin/executives", icon: Users },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "News", href: "/admin/news", icon: BookOpen },
    { name: "Magazine", href: "/admin/magazines", icon: BookOpen },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    { name: "Contact Inbox", href: "/admin/contact", icon: Mail },
    { name: "Courses", href: "/admin/courses", icon: GraduationCap },
    { name: "Resources", href: "/admin/resources", icon: LinkIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <>
      <Head>
        <title>SoSHSA Admin | {pageTitle}</title>
      </Head>
      <div className="min-h-screen bg-white">
        <aside
          className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-gray-50 ${
            sidebarOpen ? "w-64" : "w-17"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4">
            {sidebarOpen && (
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    fill
                    priority
                    alt="SOSHSHA Logo"
                    src="/images/logo.jpeg"
                    className="object-contain"
                  />
                </div>

                <span className="text-[clamp(1.2rem,2vw,1.3rem)] font-bold tracking-wide text-teal-500 whitespace-nowrap">
                  SOSHSA
                </span>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer rounded-full bg-white p-2 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <ArrowLeftIcon size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                    active
                      ? " text-teal-500 bg-teal-100/70"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${!sidebarOpen && "justify-center"}`}
                  title={!sidebarOpen ? item.name : ""}
                >
                  <Icon size={20} />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 ">
            <button
              onClick={() => {
                router.push("/admin/auth/sign-in");
              }}
              className={`cursor-pointer flex items-center gap-3 px-3 py-2.5 w-full text-gray-700 hover:bg-gray-100 rounded transition-colors ${
                !sidebarOpen && "justify-center"
              }`}
              title={!sidebarOpen ? "Logout" : ""}
            >
              <LogOut size={20} />
              {sidebarOpen && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </aside>

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <header className="sticky top-0 z-30 bg-white h-16 flex items-center px-8">
            <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
          </header>

          <main className="p-8 bg-white">{children}</main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
