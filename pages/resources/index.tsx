import useSWR from "swr";
import axios from "axios";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import { Download, ExternalLink, FileText, Video } from "lucide-react";

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

const fetchCitationFiles = async (): Promise<CitationFile[]> => {
  const { data } = await axios.get(`${BASE_URL}/citation-files`);
  return data.data;
};

const fetchUsefulLinks = async (): Promise<UsefulLink[]> => {
  const { data } = await axios.get(`${BASE_URL}/useful-links`);
  return data.data;
};

const ResourcesPage = () => {
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

  const groupedCitations = citationFiles.reduce(
    (acc, file) => {
      if (!acc[file.category]) acc[file.category] = [];
      acc[file.category].push(file);
      return acc;
    },
    {} as Record<string, CitationFile[]>,
  );

  const getIcon = (format: string) => {
    if (format === "MP4") return <Video size={20} className="text-primary" />;
    return <FileText size={20} className="text-primary" />;
  };

  return (
    <Layout
      title="SOSHSA | Resources"
      description="Access citation guides, academic resources, and useful links"
    >
      <section className="relative bg-white py-10 lg:py-15">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mb-16"
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
              Access citation guides, academic tools, and helpful links
            </p>
          </motion.div>

          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Citation Toolkit
            </h2>

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
                            {getIcon(file.format)}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Useful Links
            </h2>

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
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ResourcesPage;
