import Image from "next/image";
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative h-[70vh] md:h-[80vh] w-full">
      <div className="absolute inset-0">
        <Image
          fill
          priority
          sizes="100vw"
          alt="SoSHSA Community"
          className="object-cover"
          src="/images/about/hero.jpg"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative h-full flex items-end pb-16 md:pb-24">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-primary text-sm uppercase tracking-widest mb-4">
                About SoSHSA
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
                The Voice of Social Science
                <br />
                <span className="text-primary">& Humanities Students</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-2xl">
                Empowering students, building communities, and shaping futures
                at the University of The Gambia since 2010.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
