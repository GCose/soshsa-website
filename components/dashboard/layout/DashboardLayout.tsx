import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
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
  ChevronDown,
  User,
  Video,
  FileText,
  Download,
} from "lucide-react";
import { DashboardLayoutProps } from "@/types/interface/dashboard";

const DashboardLayout = ({ children, pageTitle }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarOpen");
      return saved !== null ? saved === "true" : true;
    }
    return true;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigationGroups = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "CONTENT",
      items: [
        { name: "Councils", href: "/admin/councils", icon: Users },
        { name: "Events", href: "/admin/events", icon: Calendar },
        { name: "News", href: "/admin/news", icon: BookOpen },
        { name: "Magazine", href: "/admin/magazines", icon: BookOpen },
        { name: "Comments", href: "/admin/comments", icon: MessageSquare },
      ],
    },
    {
      title: "INDUCTION",
      items: [
        {
          name: "Courses",
          href: "/admin/induction/courses",
          icon: GraduationCap,
        },
        {
          name: "Portal Guide",
          href: "/admin/induction/portal-guide",
          icon: FileText,
        },
        {
          name: "Association Intro",
          href: "/admin/induction/intro",
          icon: Video,
        },
      ],
    },
    {
      title: "RESOURCES",
      items: [
        {
          name: "Citation Files",
          href: "/admin/resources/citations",
          icon: Download,
        },
        {
          name: "Useful Links",
          href: "/admin/resources/links",
          icon: LinkIcon,
        },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Inbox", href: "/admin/inbox", icon: Mail },
        { name: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Head>
        <title>{`SoSHSA Admin | ${pageTitle}`}</title>
      </Head>
      <div className="min-h-screen bg-white">
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-gray-50 md:bg-gray-100/60 rounded-tr-[3rem] rounded-br-[3rem]
            ${sidebarOpen ? "w-64" : "w-20"} 
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0`}
        >
          <div className="flex items-center justify-between h-16 px-4">
            {sidebarOpen && (
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    fill
                    priority
                    alt="SOSHSA Logo"
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
              className="cursor-pointer rounded-full bg-white p-2 hover:bg-gray-100 transition-colors hidden lg:block"
            >
              {sidebarOpen ? <ArrowLeftIcon size={20} /> : <Menu size={20} />}
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="cursor-pointer rounded-full bg-white p-2 hover:bg-gray-100 transition-colors lg:hidden"
            >
              <ArrowLeftIcon size={20} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.title}>
                {sidebarOpen && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                          active
                            ? "text-teal-500 bg-teal-100/70"
                            : "text-gray-700 hover:bg-gray-100"
                        } ${!sidebarOpen && "justify-center"}`}
                        title={!sidebarOpen ? item.name : ""}
                      >
                        <Icon size={20} />
                        {sidebarOpen && (
                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:ml-64" : "lg:ml-20"
          }`}
        >
          <header className="sticky top-0 z-30 bg-white h-16 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="cursor-pointer lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {pageTitle}
              </h1>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                  <User size={20} className="text-teal-500" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@soshsa.com</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">admin@soshsa.com</p>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/admin/settings");
                    }}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/admin/auth/sign-in");
                    }}
                    className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>

          <main className="p-4 lg:p-8 bg-white">{children}</main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
