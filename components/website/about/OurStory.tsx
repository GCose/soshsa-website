import Image from "next/image";
import { motion } from "framer-motion";

const OurStory = () => {
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm uppercase tracking-widest mb-4">
            Who We Are
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Building Bridges Between Students, Leadership, and Community
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            The Social Sciences and Humanities Students{"'"} Association
            (SoSHSA) stands as one of the University of The Gambia{"'"}s most
            vibrant and impactful student organizations. We represent hundreds
            of students across diverse academic disciplines, serving as the
            essential link between the student body, the Students{"'"} Union,
            and university administration.
          </p>
        </motion.div>

        <motion.div
          className="relative h-[400px] md:h-screen mb-16 md:mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            fill
            alt="SoSHSA Community"
            className="object-cover"
            src="/images/about/story-1.jpg"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-16 md:mb-24">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Our Foundation
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Since our establishment at UTG, we{"'"}ve grown from a small group
              of passionate students into a powerful force for positive change.
              Our association brings together minds from sociology, history,
              political science, anthropology, and beyond—creating a rich
              tapestry of perspectives and ideas.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              What sets us apart is our commitment to more than just academic
              representation. We{"'"}re builders of community, facilitators of
              dialogue, and champions of student welfare.
            </p>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative h-[400px] md:h-[800px]">
              <Image
                fill
                className="object-cover"
                alt="Students collaborating"
                src="/images/about/story-2.jpg"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <motion.div
            className="lg:col-span-7 order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-[400px] md:h-[800px]">
              <Image
                fill
                className="object-cover"
                alt="Community outreach"
                src="/images/about/story-3.jpg"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Beyond the Campus
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Our impact extends far beyond lecture halls. Through community
              radio programs, school outreach initiatives, and partnerships with
              local organizations, we{"'"}re creating real change in communities
              across The Gambia.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From hosting workshops on critical thinking to organizing cultural
              festivals that celebrate our diverse heritage, we{"'"}re proving
              that student activism and community service go hand in hand.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
