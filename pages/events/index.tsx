import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Layout from "@/components/website/Layout";
import Button from "@/components/dashboard/ui/Button";
import { EventSkeleton } from "@/components/website/skeletons/Skeleton";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description?: string;
  imageUrl: string;
  isFeatured: boolean;
}

const fetchPublishedEvents = async (): Promise<Event[]> => {
  const { data } = await axios.get(`${BASE_URL}/events`, {
    params: { isPublished: true, limit: 15 },
  });
  return data.data.data;
};

const EventsPage = () => {
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: events = [], isLoading } = useSWR(
    "published-events",
    fetchPublishedEvents,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    },
  );

  const eventTypes = ["all", ...Array.from(new Set(events.map((e) => e.type)))];

  const filteredEvents =
    selectedType === "all"
      ? events
      : events.filter((e) => e.type === selectedType);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear().toString(),
    };
  };

  return (
    <Layout
      title="SoSHSA | Events"
      description="Explore upcoming and past events from the Social Sciences and Humanities Students Association."
    >
      <section className="relative bg-white py-10 lg:py-15">
        <div className="w-full px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              What{"'"}s Happening
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Events & Programs
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join us for engaging programs, workshops, and community
              initiatives designed to empower students.
            </p>
          </motion.div>

          <motion.div
            className="flex gap-3 mb-12 overflow-x-auto pb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {eventTypes.map((type) => (
              <Button
                variant="secondary"
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "all" ? "All Events" : type}
              </Button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <EventSkeleton key={i} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h1 className="text-2xl font-bold uppercase text-gray-900 mb-4">
                No Events Found
              </h1>
              <p className="text-gray-500 text-lg">
                No events available at the moment.
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/events/${event.id}`} className="group block">
                    <div className="relative h-96 overflow-hidden bg-gray-200 mb-4">
                      <Image
                        fill
                        alt={event.title}
                        src={event.imageUrl}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute top-6 left-6">
                        <div className="bg-primary px-4 py-2 text-white">
                          <div className="text-2xl font-bold leading-none">
                            {formatDate(event.date).day}
                          </div>
                          <div className="text-xs uppercase tracking-wide">
                            {formatDate(event.date).month}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs uppercase tracking-wide text-primary font-medium">
                        {event.type}
                      </span>
                      <h3 className="text-xl uppercase font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
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
                        {event.location}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
