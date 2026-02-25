import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import { ArticleDetailSkeleton } from "@/components/website/skeletons/Skeleton";

interface Event {
  id: string;
  type: string;
  date: string;
  title: string;
  location: string;
  imageUrl: string;
  description?: string;
}

const fetchEvent = async (eventId: string): Promise<Event> => {
  const { data } = await axios.get(`${BASE_URL}/events/${eventId}`);
  return data.data;
};

const EventDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: event, isLoading } = useSWR(
    id ? `event-${id}` : null,
    () => fetchEvent(id as string),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Layout title="SoSHSA | Loading..." description="Loading event details">
        <section className="relative bg-white py-10 lg:py-15">
          <ArticleDetailSkeleton />
        </section>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout title="SoSHSA | Event Not Found" description="Event not found">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg">Event not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`SoSHSA | ${event.title}`} description={event.description}>
      <article className="relative bg-white py-10 lg:py-15">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-8 group"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Events
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full h-96 md:h-screen overflow-hidden mb-8">
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover md:object-contain"
              />
            </div>

            <div className="max-w-4xl">
              <span className="inline-block text-sm uppercase tracking-wide text-primary font-medium mb-4">
                {event.type}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>

              {event.description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
};

export default EventDetailPage;
