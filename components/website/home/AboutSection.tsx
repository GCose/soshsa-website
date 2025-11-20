import Link from "next/link";

const AboutSection = () => (
  <section className="relative min-h-screen bg-white py-24 lg:py-32">
    <div className="w-full px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-7 grid grid-rows-[auto_auto_1fr] gap-12">
          <div>
            <p className="text-primary text-sm uppercase tracking-widest mb-3">
              Who We Are
            </p>
            <h2 className="text-fluid-4xl font-bold text-dark leading-tight">
              Bridging Students,
              <br />
              Building Futures
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6 text-dark/80 text-lg leading-relaxed">
            <p className="col-span-12">
              The Social Sciences and Humanities Students{"'"} Association is
              one of UTG{"'"}s most vibrant sub-associations, uniting hundreds
              of students across diverse academic units.
            </p>
            <p className="col-span-12">
              Since our formation, we{"'"}ve pioneered purpose-driven
              partnerships, community radio programs, and campus initiatives
              that serve as the vital link between students, the Students{"'"}{" "}
              Union, and university authorities.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-10 items-start">
            <div className="col-span-6">
              <div className="text-4xl lg:text-5xl font-bold text-primary">
                500+
              </div>
              <div className="text-dark/60 text-sm uppercase tracking-wide">
                Active Members
              </div>
            </div>
            <div class-time="col-span-6">
              <div className="text-4xl lg:text-5xl font-bold text-primary">
                15+
              </div>
              <div className="text-dark/60 text-sm uppercase tracking-wide">
                Community Programs
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 border-l border-gray-300 pl-6 lg:pl-10">
          <div className="bg-teal-200 p-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Focus</h3>
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-gray-700">
                  Democratic student representation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-gray-700">
                  Community engagement & outreach
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-gray-700">
                  Knowledge sharing & collaboration
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary text-xl">→</span>
                <span className="text-gray-700">
                  Student welfare & development
                </span>
              </li>
            </ul>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-gray-900 text-lg font-medium group border-b-2 border-gray-900 pb-1 hover:border-primary hover:text-primary transition-colors"
            >
              Learn More About Us
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
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
