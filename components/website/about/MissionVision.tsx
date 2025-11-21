import Image from "next/image";
import { motion } from "framer-motion";

const MissionVision = () => {
  return (
    <section className="relative bg-gray-50 py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mb-20 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-primary p-2 inline-block mb-6">
                <p className="text-white text-sm uppercase tracking-widest px-4 py-2">
                  Our Mission
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Promoting Relevant Education Through Democratic Representation
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  We exist to promote meaningful education and safeguard the
                  welfare of students within the Division of Humanities and
                  Social Sciences. Through democratic representation and
                  sustainable cooperation, we work tirelessly to develop
                  students in both career and character.
                </p>
                <p>
                  Our mission drives us to create partnerships built on common
                  interest, fostering an environment where every student voice
                  matters and every concern receives attention. We{"'"}re not
                  just an association—we{"'"}re a movement dedicated to
                  transforming student experiences at UTG.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-[400px] md:h-[800px]">
                <Image
                  src="/images/about/mission.jpg"
                  alt="Students in discussion"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            <motion.div
              className="lg:col-span-6 order-2 lg:order-1"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative h-[400px] md:h-[800px]">
                <Image
                  src="/images/about/vision.jpg"
                  alt="Student leadership"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-6 order-1 lg:order-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-primary p-2 inline-block mb-6">
                <p className="text-white text-sm uppercase tracking-widest px-4 py-2">
                  Our Vision
                </p>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Cultivating Excellence and Professionalism
              </h2>
              <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                <p>
                  We envision a conducive learning environment that serves as
                  fertile ground for genuine knowledge production and sharing.
                  Our vision extends beyond academic achievement to nurturing
                  sound attitudes and professionalism in every member.
                </p>
                <p>
                  We dream of a community where tolerance, solidarity,
                  understanding, and cooperation thrive—where students from
                  different backgrounds unite under shared values of respect,
                  intellectual curiosity, and social responsibility.
                </p>
                <p>
                  Through this vision, we{"'"}re not just educating students; we
                  {"'"}re shaping the responsible citizens and leaders The
                  Gambia needs for tomorrow.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVision;
