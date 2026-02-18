import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import Modal from "@/components/dashboard/ui/modals/Modal";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  type: string;
  description?: string;
  imageUrl: string;
}

const fetchFeaturedEvents = async (): Promise<Event[]> => {
  const { data } = await axios.get(`${BASE_URL}/events`, {
    params: { isFeatured: true, isPublished: true, limit: 3 },
  });
  return data.data.data;
};

const EventsSection = () => {
  const { data: events = [] } = useSWR("featured-events", fetchFeaturedEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate().toString().padStart(2, "0"),
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear().toString(),
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-screen bg-white py-20 lg:py-32">
      <div className="w-full px-6 lg:px-8">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            What{"'"}s Happening
          </p>
          <h2 className="text-fluid-4xl font-bold text-gray-900 leading-tight mb-6">
            Upcoming Events
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Join us for engaging programs, workshops, and community initiatives
            designed to empower students.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-12 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {events[0] && (
            <motion.div
              className="col-span-12 lg:col-span-7"
              variants={itemVariants}
            >
              <div
                onClick={() => handleEventClick(events[0])}
                className="group block h-full cursor-pointer"
              >
                <div className="relative h-[800px] overflow-hidden bg-gray-200 mb-6">
                  <Image
                    fill
                    src={events[0].imageUrl}
                    alt={events[0].title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-6 left-6">
                    <div className="bg-primary px-4 py-2 text-white">
                      <div className="text-2xl font-bold leading-none">
                        {formatDate(events[0].date).day}
                      </div>
                      <div className="text-xs uppercase tracking-wide">
                        {formatDate(events[0].date).month}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className="text-xs uppercase tracking-wide mb-3 block text-primary">
                      {events[0].type}
                    </span>
                    <h3 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {events[0].title}
                    </h3>
                    {events[0].description && (
                      <p className="text-white/90 mb-4">
                        {events[0].description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-white/80">
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
                      {events[0].location}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {events.slice(1).map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <div
                  onClick={() => handleEventClick(event)}
                  className="group block cursor-pointer"
                >
                  <div className="relative h-[375px] overflow-hidden bg-gray-200 mb-4">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <div className="bg-primary px-3 py-1.5 text-white">
                        <div className="text-lg font-bold leading-none">
                          {formatDate(event.date).day}
                        </div>
                        <div className="text-xs uppercase">
                          {formatDate(event.date).month}
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="text-xs uppercase tracking-wide mb-2 block text-primary">
                        {event.type}
                      </span>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-white/80">
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
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-3 text-gray-900 text-lg font-semibold group border-b-2 border-gray-900 pb-2 hover:border-primary hover:text-primary transition-colors"
          >
            View All Events
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="xxl">
          {selectedEvent && (
            <div className="space-y-6">
              <div className="relative w-full h-screen rounded-lg overflow-hidden">
                <Image
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <span className="inline-block text-sm uppercase tracking-wide text-primary font-medium mb-3">
                  {selectedEvent.type}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {selectedEvent.title}
                </h2>

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
                    <span>
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
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
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>

                {selectedEvent.description && (
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedEvent.description}
                  </p>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

export default EventsSection;
