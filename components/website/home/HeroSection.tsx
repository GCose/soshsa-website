import Link from "next/link"
import Image from "next/image"

const HeroSection = () => (
  <section className="h-screen w-full overflow-hidden flex items-center">
    <div className="absolute inset-0 top-0">
      <Image 
        fill 
        priority 
        sizes="100vw"
        alt="SoSHSA Community" 
        className="object-cover" 
        src="/images/home/hero.jpeg" 
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/10 to-black/90" />
    </div>

    <div className="relative w-full px-6 lg:px-8 h-full">
      <div className="grid grid-cols-12 gap-8 h-full">
        <div className="col-span-12 lg:col-span-5 flex items-top pt-30 ">
          <h1 className="text-fluid-4xl font-bold text-white leading-[0.9] tracking-tighter">
            Social Sciences
            <br />
            <span className="text-white">& Humanities</span>
          </h1>
        </div>

        <div className="col-span-12 lg:col-span-4 lg:col-start-10 flex items-end">
          <div className="bg-white p-8 lg:p-10">
            <p className="text-gray-900 text-lg leading-relaxed mb-6">
              Empowering voices, shaping futures. The official student association of the School of Social Science and Humanities at UTG.
            </p>
            <Link 
              href="/about" 
              className="inline-flex items-center gap-3 text-gray-900 text-lg font-medium group"
            >
              <span className="relative">
                Discover Our Story
                <span className="absolute bottom-0 left-0 w-full h-px bg-gray-900 transition-transform origin-left group-hover:scale-x-0" />
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
    </div>
  </section>
)

export default HeroSection