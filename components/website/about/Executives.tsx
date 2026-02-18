import useSWR from "swr";
import axios from "axios";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "@/utils/url";
import { Executive } from "@/types/interface/dashboard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fetchExecutives = async (): Promise<Executive[]> => {
  const { data } = await axios.get(`${BASE_URL}/executive-members`, {
    params: { isServing: true },
  });
  return data.data.data;
};

const Executives = () => {
  const { data: executives = [] } = useSWR(
    "serving-executives",
    fetchExecutives,
  );
  const councilName = executives[0]?.council?.name || "Executive Council";
  const scrollRef = useRef<HTMLDivElement>(null);

  const sortedExecutives = [...executives].reverse();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const ExecutiveCard = ({
    exec,
    index,
  }: {
    exec: Executive;
    index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full snap-center shrink-0 w-full md:w-auto"
    >
      <div className="group h-full">
        <div className="relative aspect-3/4 overflow-hidden mb-6">
          <Image
            src={exec.profilePhoto || "/images/placeholder.jpg"}
            alt={exec.fullName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="text-sm text-primary uppercase tracking-wide mb-1">
              {exec.position}
            </div>
            <div className="text-2xl font-bold text-white">{exec.fullName}</div>
          </div>
        </div>
        {exec.biography && (
          <p className="text-gray-600 leading-relaxed">{exec.biography}</p>
        )}
      </div>
    </motion.div>
  );

  if (sortedExecutives.length === 0) {
    return (
      <section className="relative bg-white py-16 md:py-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              No Executive Members
            </h1>
            <p className="text-gray-500 text-lg">
              We currently have no serving executive members. Please check back
              later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            Leadership
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {councilName}
          </h2>
          <p className="text-xl text-gray-600">
            Dedicated leaders working tirelessly to serve student interests and
            drive positive change
          </p>
        </motion.div>

        <div className="relative md:hidden">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all -ml-4"
            aria-label="Previous"
          >
            <ChevronLeft size={24} className="text-gray-900" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all -mr-4"
            aria-label="Next"
          >
            <ChevronRight size={24} className="text-gray-900" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-8 scrollbar-hide pb-4"
          >
            {sortedExecutives.map((exec, index) => (
              <ExecutiveCard key={exec.id} exec={exec} index={index} />
            ))}
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {sortedExecutives.map((exec, index) => (
            <ExecutiveCard key={exec.id} exec={exec} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Executives;
