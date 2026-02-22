import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import {
  Download,
  ExternalLink,
  FileText,
  Video,
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  department: string;
  year: number;
  creditHours: number;
  brochureUrl?: string;
  isActive: boolean;
}

interface CitationFile {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  category: "APA" | "MLA" | "Chicago" | "Tutorial" | "Other";
  format: "PDF" | "DOCX" | "MP4";
}

interface UsefulLink {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

type TabType = "brochures" | "citations" | "links";

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("brochures");
  const [coursePage, setCoursePage] = useState(1);
  const [courseSearch, setCourseSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const limit = 15;

  const fetchCourses = async () => {
    const params: Record<string, string | number> = {
      page: coursePage - 1,
      limit,
      isActive: "true",
    };
    if (courseSearch) params.search = courseSearch;
    if (yearFilter !== "all") params.year = yearFilter;

    const { data } = await axios.get(`${BASE_URL}/courses`, { params });
    return data.data;
  };

  const fetchCitationFiles = async (): Promise<CitationFile[]> => {
    const { data } = await axios.get(`${BASE_URL}/citation-files`);
    return data.data;
  };

  const fetchUsefulLinks = async (): Promise<UsefulLink[]> => {
    const { data } = await axios.get(`${BASE_URL}/useful-links`);
    return data.data;
  };

  const { data: coursesData, isLoading: loadingCourses } = useSWR(
    ["courses-public", coursePage, courseSearch, yearFilter],
    fetchCourses,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: citationFiles = [], isLoading: loadingCitations } = useSWR(
    "citation-files",
    fetchCitationFiles,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: usefulLinks = [], isLoading: loadingLinks } = useSWR(
    "useful-links",
    fetchUsefulLinks,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const courses = coursesData?.data || [];
  const totalPages = coursesData
    ? Math.ceil(coursesData.meta.total / limit)
    : 0;

  const groupedCitations = citationFiles.reduce(
    (acc, file) => {
      if (!acc[file.category]) acc[file.category] = [];
      acc[file.category].push(file);
      return acc;
    },
    {} as Record<string, CitationFile[]>,
  );

  const tabs = [
    { id: "brochures" as TabType, label: "Course Brochures", icon: BookOpen },
    { id: "citations" as TabType, label: "Citation Toolkit", icon: FileText },
    { id: "links" as TabType, label: "Useful Links", icon: ExternalLink },
  ];

  const getFileIcon = (format: string) => {
    if (format === "MP4") return <Video size={20} className="text-primary" />;
    return <FileText size={20} className="text-primary" />;
  };

  return (
    <Layout
      title="SoSHSA | Resources"
      description="Access course brochures, citation guides, and useful links"
    >
      <section className="relative bg-white py-20 lg:py-32">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              Academic Resources
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Resources & Tools
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Access course brochures, citation guides, and helpful links
            </p>
          </motion.div>

          <div className="border-b border-gray-200 mb-12">
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === "brochures" && (
            <div>
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by course code or title..."
                    value={courseSearch}
                    onChange={(e) => {
                      setCourseSearch(e.target.value);
                      setCoursePage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <select
                  value={yearFilter}
                  onChange={(e) => {
                    setYearFilter(
                      e.target.value === "all" ? "all" : Number(e.target.value),
                    );
                    setCoursePage(1);
                  }}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="all">All Years</option>
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                  <option value={5}>Year 5</option>
                </select>
              </div>

              {loadingCourses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-20 mb-3"></div>
                      <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : courses.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  No course brochures found.
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {courses.map((course: Course, index: number) => (
                      <motion.div
                        key={course.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                              {course.code}
                            </span>
                            <span className="ml-2 text-xs text-gray-600">
                              Year {course.year}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {course.creditHours} CH
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {course.title}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                          {course.department}
                        </p>

                        {course.brochureUrl && (
                          <a
                            href={course.brochureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                          >
                            <Download size={16} />
                            Download Brochure
                          </a>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCoursePage((p) => Math.max(1, p - 1))}
                        disabled={coursePage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <span className="text-sm text-gray-600">
                        Page {coursePage} of {totalPages}
                      </span>

                      <button
                        onClick={() =>
                          setCoursePage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={coursePage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "citations" && (
            <div>
              {loadingCitations ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : Object.keys(groupedCitations).length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  No citation resources available at the moment.
                </p>
              ) : (
                <div className="space-y-12">
                  {Object.entries(groupedCitations).map(([category, files]) => (
                    <div key={category}>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {files.map((file, index) => (
                          <motion.a
                            key={file.id}
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              {getFileIcon(file.format)}
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                                  {file.title}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {file.format}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              {file.description}
                            </p>
                            <div className="flex items-center gap-2 text-primary text-sm font-medium">
                              <Download size={16} />
                              Download
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "links" && (
            <div>
              {loadingLinks ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : usefulLinks.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                  No useful links available at the moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {usefulLinks.map((link, index) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <ExternalLink size={20} className="text-primary mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                            {link.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {link.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {link.description}
                      </p>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesPage;
