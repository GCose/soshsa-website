import Link from "next/link";

const EventsSection = () => {
  const events = [
    {
      id: 1,
      date: { day: "15", month: "Dec" },
      title: "Annual General Meeting 2024",
      location: "Main Campus Auditorium",
      type: "Meeting",
    },
    {
      id: 2,
      date: { day: "22", month: "Dec" },
      title: "Community Outreach Program",
      location: "Banjul Community Center",
      type: "Outreach",
    },
    {
      id: 3,
      date: { day: "08", month: "Jan" },
      title: "New Year Academic Workshop",
      location: "UTG Library Hall",
      type: "Workshop",
    },
  ];

  return (
    <section className="relative min-h-screen bg-white py-20 lg:py-32">
      <div className="w-full px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="text-primary text-sm uppercase tracking-widest mb-4">
              What{"'"}s Happening
            </p>
            <h2 className="text-fluid-4xl font-bold text-gray-900 leading-tight mb-6">
              Upcoming
              <br />
              Events
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Join us for engaging programs, workshops, and community
              initiatives designed to empower students and foster collaboration.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-3 text-gray-900 text-lg font-semibold group"
            >
              <span className="relative">
                See All Events
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 transition-transform origin-left group-hover:scale-x-0" />
              </span>
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
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="space-y-6">
              {events.map((event, index) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block group"
                >
                  <div className="bg-gray-50 p-6 lg:p-8 transition-transform hover:-translate-y-2 hover:shadow-xl">
                    <div className="flex gap-6">
                      <div className="shrink-0">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 flex flex-col items-center justify-center">
                          <div className="text-2xl lg:text-3xl font-bold text-primary leading-none">
                            {event.date.day}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-600 uppercase tracking-wide">
                            {event.date.month}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <span className="shrink-0 text-xs uppercase tracking-wide px-3 py-1 bg-white text-gray-600 rounded">
                            {event.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
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
                          <span className="text-sm">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
