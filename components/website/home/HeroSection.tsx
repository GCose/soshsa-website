import Link from "next/link"
import Image from "next/image"

const HeroSection = () => (
  <section className="relative h-screen w-full overflow-hidden">
    <div className="absolute inset-0">
      <Image src="/diverse-university-students-in-modern-campus-setti.jpg" alt="SoSHSA Community" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
    </div>

    <div className="relative h-full max-w-[1600px] mx-auto px-6 lg:px-12">
      <div className="h-full flex flex-col justify-end pb-20 lg:pb-32">
        <div className="max-w-5xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
            Social Sciences
            <br />
            <span className="text-primary">& Humanities</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed mb-12">
            Empowering voices, shaping futures. The official student association of the School of Social Science and
            Humanities at UTG.
          </p>
          <Link href="/about" className="inline-flex items-center gap-3 text-white text-lg font-medium group">
            <span className="relative">
              Discover Our Story
              <span className="absolute bottom-0 left-0 w-full h-px bg-white transition-transform origin-left group-hover:scale-x-0" />
            </span>
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  </section>
)

export default HeroSection
