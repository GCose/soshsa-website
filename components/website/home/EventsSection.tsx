import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const EventsSection = () => {
  const events = [
    {
      id: 1,
      date: { day: "15", month: "Dec", year: "2024" },
      title: "Annual General Meeting",
      description:
        "Join us for our yearly AGM where we review achievements and set goals for the upcoming year.",
      location: "Main Campus Auditorium",
      image: "/images/home/event-1.webp",
      type: "Meeting",
    },
    {
      id: 2,
      date: { day: "22", month: "Dec", year: "2024" },
      title: "Community Outreach Program",
      description:
        "Engaging with local communities to promote education and social awareness.",
      location: "Banjul Community Center",
      image: "/images/home/event-2.webp",
      type: "Outreach",
    },
    {
      id: 3,
      date: { day: "08", month: "Jan", year: "2025" },
      title: "New Year Academic Workshop",
      description:
        "Start the year strong with our intensive workshop on research methodologies.",
      location: "UTG Library Hall",
      image: "/images/home/event-3.webp",
      type: "Workshop",
    },
  ];

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
          <motion.div
            className="col-span-12 lg:col-span-7"
            variants={itemVariants}
          >
            <Link
              href={`/events/${events[0].id}`}
              className="group block h-full"
            >
              <div className="relative h-[800px] overflow-hidden bg-gray-200 mb-6">
                <Image
                  src={events[0].image}
                  alt={events[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-6 left-6">
                  <div className="bg-primary px-4 py-2 text-white">
                    <div className="text-2xl font-bold leading-none">
                      {events[0].date.day}
                    </div>
                    <div className="text-xs uppercase tracking-wide">
                      {events[0].date.month}
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
                  <p className="text-white/90 mb-4">{events[0].description}</p>
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
            </Link>
          </motion.div>

          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {events.slice(1).map((event, index) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link href={`/events/${event.id}`} className="group block">
                  <div className="relative h-[375px] overflow-hidden bg-gray-200 mb-4">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <div className="bg-primary px-3 py-1.5 text-white text-sm">
                        <div className="font-bold">
                          {event.date.day} {event.date.month}
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
                      <p className="text-sm text-white/80 mb-2 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/70">
                        <svg
                          className="w-3 h-3"
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
                </Link>
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
      </div>
    </section>
  );
};

export default EventsSection;
