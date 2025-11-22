import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const CommunityImpact = () => {
  const impactAreas = [
    {
      title: "Radio Programs",
      description:
        "Broadcasting student voices and community stories across The Gambia, reaching thousands of listeners weekly with programs that educate, inform, and inspire.",
      image: "/images/about/community-1.jpg",
    },
    {
      title: "School Outreach",
      description:
        "Partnering with secondary schools to mentor the next generation, sharing knowledge about university life and academic pathways in social sciences and humanities.",
      image: "/images/about/community-2.jpg",
    },
    {
      title: "Community Service",
      description:
        "Organizing regular initiatives that give back to local communities—from literacy programs to cultural preservation projects that celebrate Gambian heritage.",
      image: "/images/about/community-3.jpg",
    },
  ];

  return (
    <section className="relative bg-gray-900 py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            Our Reach
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
            Making a Real Difference
          </h2>
          <p className="text-xl text-white/80">
            See how we{"'"}re creating lasting impact beyond campus boundaries
          </p>
        </motion.div>

        <div className="space-y-16 md:space-y-24">
          {impactAreas.map((area, index) => (
            <motion.div
              key={area.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:grid-flow-dense" : ""
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                <div className="relative h-[300px] md:h-[400px]">
                  <Image
                    src={area.image}
                    alt={area.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div
                className={
                  index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                }
              >
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                  {area.title}
                </h3>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  {area.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-20 md:mt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Want to be part of something bigger?
          </h3>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join us in building a stronger student community and creating
            lasting impact across The Gambia.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-4 text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Involved
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunityImpact;
