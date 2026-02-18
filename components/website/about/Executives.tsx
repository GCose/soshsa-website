import Image from "next/image";
import { motion } from "framer-motion";

const Executives = () => {
  const executives = [
    {
      name: "Aisha Jallow",
      position: "President",
      image: "/images/about/exec-4.jpg",
      bio: "Leading SoSHSA with a vision for inclusive student representation and academic excellence across all divisions.",
    },
    {
      name: "Omar Ceesay",
      position: "Vice President",
      image: "/images/about/exec-1.jpg",
      bio: "Championing student welfare initiatives and coordinating strategic partnerships with community organizations.",
    },
    {
      name: "Fatou Sanneh",
      position: "Secretary General",
      image: "/images/about/exec-5.jpg",
      bio: "Managing organizational operations and ensuring transparent communication across all association activities.",
    },
    {
      name: "Lamin Bah",
      position: "Treasurer",
      image: "/images/about/exec-2.jpg",
      bio: "Overseeing financial planning and ensuring responsible allocation of resources for student programs.",
    },
    {
      name: "Mariama Drammeh",
      position: "Public Relations Officer",
      image: "/images/about/exec-5.jpg",
      bio: "Building community relations and amplifying SoSHSA's voice across multiple platforms and media.",
    },
    {
      name: "Modou Jallow",
      position: "Programs Director",
      image: "/images/about/exec-3.jpg",
      bio: "Designing and executing impactful programs that directly serve student interests and community needs.",
    },
  ];

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
            Meet Your Executive Team
          </h2>
          <p className="text-xl text-gray-600">
            Dedicated leaders working tirelessly to serve student interests and
            drive positive change
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {executives.map((exec, index) => (
            <motion.div
              key={exec.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="group">
                <div className="relative aspect-3/4 overflow-hidden mb-6">
                  <Image
                    src={exec.image}
                    alt={exec.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-sm text-primary uppercase tracking-wide mb-1">
                      {exec.position}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {exec.name}
                    </div>
                  </div>
                </div>
                {/* <p className="text-gray-600 leading-relaxed">{exec.bio}</p> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Executives;
