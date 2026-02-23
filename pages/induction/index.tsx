import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";

interface AssociationIntro {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  imageUrls: string[];
  isPublished: boolean;
}

const fetchAssociationIntro = async (): Promise<AssociationIntro | null> => {
  const { data } = await axios.get(`${BASE_URL}/association-intros`, {
    params: { isPublished: "true", limit: 1 },
  });
  return data.data.data[0] || null;
};

const getVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const InductionPage = () => {
  const { data: intro, isLoading } = useSWR(
    "association-intro",
    fetchAssociationIntro,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  if (isLoading) {
    return (
      <Layout title="SoSHSA | Induction" description="Welcome to SoSHSA">
        <section className="relative bg-white py-10 lg:py-15">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
            <div className="animate-pulse space-y-8">
              <div className="h-10 bg-gray-200 rounded w-64"></div>
              <div className="aspect-video bg-gray-200 rounded-lg"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!intro) {
    return (
      <Layout title="SoSHSA | Induction" description="Welcome to SoSHSA">
        <section className="relative bg-white py-10 lg:py-15">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 text-center py-20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to SoSHSA
            </h1>
            <p className="text-gray-600 text-lg">
              Induction content will be available soon.
            </p>
          </div>
        </section>
      </Layout>
    );
  }

  const videoId = getVideoId(intro.videoUrl);

  return (
    <Layout title={`SoSHSA | ${intro.title}`} description={intro.description}>
      <section className="relative bg-white py-10 lg:py-15">
        <div className="w-full mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              Welcome to SoSHSA
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-12">
              {intro.title}
            </h1>

            {videoId && (
              <div className="aspect-video overflow-hidden bg-gray-900 mb-12">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={intro.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
                {intro.description}
              </p>
            </div>

            {intro.imageUrls && intro.imageUrls.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {intro.imageUrls.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${intro.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default InductionPage;
