import useSWR from "swr";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, Toaster } from "sonner";
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
import useDebounce from "@/utils/debounce";

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
  fileUrl?: string;
  category: string;
}

interface CitationsResponse {
  data: CitationFile[];
  meta: {
    total: number;
  };
}

interface LinksResponse {
  data: UsefulLink[];
  meta: {
    total: number;
  };
}

type TabType = "brochures" | "citations" | "links";

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("brochures");
  const [coursePage, setCoursePage] = useState(1);
  const [courseSearch, setCourseSearch] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [downloading, setDownloading] = useState<string | null>(null);
  const limit = 15;

  const [citationsPage, setCitationsPage] = useState(0);
  const [allCitations, setAllCitations] = useState<CitationFile[]>([]);
  const [totalCitations, setTotalCitations] = useState(0);
  const [loadingMoreCitations, setLoadingMoreCitations] = useState(false);

  const [linksPage, setLinksPage] = useState(0);
  const [allLinks, setAllLinks] = useState<UsefulLink[]>([]);
  const [totalLinks, setTotalLinks] = useState(0);
  const [loadingMoreLinks, setLoadingMoreLinks] = useState(false);

  const debouncedCourseSearch = useDebounce(courseSearch, 500);

  const fetchCourses = async () => {
    const params: Record<string, string | number> = {
      page: coursePage - 1,
      limit,
      isActive: "true",
    };

    if (debouncedCourseSearch) params.department = debouncedCourseSearch;
    if (yearFilter !== "all") params.year = yearFilter;

    const { data } = await axios.get(`${BASE_URL}/courses`, { params });
    return data.data;
  };

  const fetchInitialCitations = async (): Promise<CitationsResponse> => {
    const { data } = await axios.get(`${BASE_URL}/citation-files`, {
      params: { page: 0, limit: 12 },
    });
    return data.data;
  };

  const fetchInitialLinks = async (): Promise<LinksResponse> => {
    const { data } = await axios.get(`${BASE_URL}/useful-links`, {
      params: { page: 0, limit: 12 },
    });
    return data.data;
  };

  const { data: coursesData, isLoading: loadingCourses } = useSWR(
    ["courses-public", coursePage, debouncedCourseSearch, yearFilter],
    fetchCourses,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: initialCitationsData, isLoading: loadingCitations } = useSWR(
    "citation-files-initial",
    fetchInitialCitations,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const { data: initialLinksData, isLoading: loadingLinks } = useSWR(
    "useful-links-initial",
    fetchInitialLinks,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  useEffect(() => {
    if (initialCitationsData) {
      setAllCitations(initialCitationsData.data);
      setTotalCitations(initialCitationsData.meta.total);
    }
  }, [initialCitationsData]);

  useEffect(() => {
    if (initialLinksData) {
      setAllLinks(initialLinksData.data);
      setTotalLinks(initialLinksData.meta.total);
    }
  }, [initialLinksData]);

  const loadMoreCitations = async () => {
    setLoadingMoreCitations(true);
    try {
      const nextPage = citationsPage + 1;
      const { data } = await axios.get(`${BASE_URL}/citation-files`, {
        params: { page: nextPage, limit: 12 },
      });
      setAllCitations((prev) => [...prev, ...data.data.data]);
      setCitationsPage(nextPage);
    } catch {
      toast.error("Failed to load more citations");
    } finally {
      setLoadingMoreCitations(false);
    }
  };

  const loadMoreLinks = async () => {
    setLoadingMoreLinks(true);
    try {
      const nextPage = linksPage + 1;
      const { data } = await axios.get(`${BASE_URL}/useful-links`, {
        params: { page: nextPage, limit: 12 },
      });
      setAllLinks((prev) => [...prev, ...data.data.data]);
      setLinksPage(nextPage);
    } catch {
      toast.error("Failed to load more links");
    } finally {
      setLoadingMoreLinks(false);
    }
  };

  const courses = coursesData?.data || [];
  const totalPages = coursesData
    ? Math.ceil(coursesData.meta.total / limit)
    : 0;

  const groupedCitations = allCitations.reduce(
    (acc, file) => {
      if (!acc[file.category]) acc[file.category] = [];
      acc[file.category].push(file);
      return acc;
    },
    {} as Record<string, CitationFile[]>,
  );

  const hasMoreCitations = allCitations.length < totalCitations;
  const hasMoreLinks = allLinks.length < totalLinks;

  const handleDownload = async (
    fileUrl: string,
    fileName: string,
    folder: string,
  ) => {
    setDownloading(fileUrl);
    try {
      const fileNameFromUrl = fileUrl.split("/").pop();
      if (!fileNameFromUrl) {
        toast.error("Invalid file URL");
        return;
      }

      const response = await axios.get(
        `https://jeetix-file-service.onrender.com/api/storage/file/${folder}/${fileNameFromUrl}`,
      );

      if (
        response.data.status === "success" &&
        response.data.data.metadata?.mediaLink
      ) {
        const mediaLink = response.data.data.metadata.mediaLink;

        const fileResponse = await axios.get(mediaLink, {
          responseType: "blob",
        });
        const blob = new Blob([fileResponse.data]);
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        toast.success("Download started");
      } else {
        toast.error("Failed to get download link");
      }
    } catch (error) {
      toast.error("Failed to download file");
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

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
    <>
      <Toaster position="top-right" richColors />
      <Layout
        title="SoSHSA | Resources"
        ogImage="/images/logo.jpeg"
        keywords="SOSHSA resources, SOSHSA course brochures, SOSHSA citation guides, SOSHSA useful links, SOSHSA academic resources, SOSHSA student tools, SoSHSA UTG resources"
        description="Access course brochures, citation guides, and useful links"
      >
        <section className="relative bg-white py-15 lg:py-15">
          <div className="w-full mx-auto px-6 lg:px-8">
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
                      placeholder="Search by department..."
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value);
                        setCoursePage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border border-teal-100 focus:border-teal-200 rounded-lg"
                    />
                  </div>
                  <select
                    value={yearFilter}
                    onChange={(e) => {
                      setYearFilter(
                        e.target.value === "all"
                          ? "all"
                          : Number(e.target.value),
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
                            <button
                              onClick={() =>
                                handleDownload(
                                  course.brochureUrl!,
                                  `${course.code}-brochure.pdf`,
                                  "soshsa/courses",
                                )
                              }
                              disabled={downloading === course.brochureUrl}
                              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              <Download size={16} />
                              {downloading === course.brochureUrl
                                ? "Downloading..."
                                : "Download Brochure"}
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            setCoursePage((p) => Math.max(1, p - 1))
                          }
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
                  <>
                    <div className="space-y-12">
                      {Object.entries(groupedCitations).map(
                        ([category, files]) => (
                          <div key={category}>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                              {category}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {files.map((file, index) => (
                                <motion.div
                                  key={file.id}
                                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group cursor-pointer"
                                  onClick={() =>
                                    handleDownload(
                                      file.fileUrl,
                                      `${file.title}.${file.format.toLowerCase()}`,
                                      "soshsa/citations",
                                    )
                                  }
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                  }}
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
                                    {downloading === file.fileUrl
                                      ? "Downloading..."
                                      : "Download"}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>

                    {hasMoreCitations && (
                      <div className="flex justify-center pt-8">
                        <button
                          onClick={loadMoreCitations}
                          disabled={loadingMoreCitations}
                          className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingMoreCitations ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "links" && (
              <div>
                {loadingLinks ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                ) : allLinks.length === 0 ? (
                  <p className="text-gray-500 text-center py-10">
                    No useful links available at the moment.
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allLinks.map((link, index) => (
                        <motion.div
                          key={link.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow group"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <ExternalLink
                              size={20}
                              className="text-primary mt-1"
                            />
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors mb-1">
                                {link.title}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {link.category}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            {link.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
                            >
                              <ExternalLink size={14} />
                              Visit Link
                            </a>
                            {link.fileUrl && link.fileUrl.trim() !== "" && (
                              <button
                                onClick={() =>
                                  handleDownload(
                                    link.fileUrl!,
                                    `${link.title}.pdf`,
                                    "soshsa/links",
                                  )
                                }
                                disabled={downloading === link.fileUrl}
                                className="inline-flex items-center gap-2 text-gray-700 text-sm font-medium hover:text-primary disabled:opacity-50"
                              >
                                <Download size={14} />
                                {downloading === link.fileUrl
                                  ? "Downloading..."
                                  : "Download File"}
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {hasMoreLinks && (
                      <div className="flex justify-center pt-8">
                        <button
                          onClick={loadMoreLinks}
                          disabled={loadingMoreLinks}
                          className="px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingMoreLinks ? "Loading..." : "Load More"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ResourcesPage;
