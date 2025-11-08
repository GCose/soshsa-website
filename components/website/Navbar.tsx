import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Magazine", href: "/magazine" },
    { label: "Induction", href: "/induction" },
    { label: "Events", href: "/events" },
    { label: "Resources", href: "/resources" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-transparent backdrop-blur-sm border-b border-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden transition-transform group-hover:scale-105">
              <Image 
                src="/images/logo.jpeg" 
                alt="SoSHSA Logo" 
                width={48} 
                height={48}
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-white">SoSHSA</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
            aria-label="Toggle menu"
          >
            <div className="w-full flex flex-col gap-1.5">
              <span
                className={`w-full h-0.5 bg-gray-900 transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span className={`w-full h-0.5 bg-gray-900 transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span
                className={`w-full h-0.5 bg-gray-900 transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-base font-medium text-gray-900 hover:text-primary hover:translate-x-2 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar