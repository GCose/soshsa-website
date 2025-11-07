"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/magazine", label: "Magazine" },
    { href: "/induction", label: "Induction" },
    { href: "/news", label: "News" },
    { href: "/events", label: "Events" },
    { href: "/resources/citation", label: "Citation" },
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/*==================== Logo ====================*/}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
              <Image src="/images/logo.jpeg" alt="SOSHSA Logo" fill className="object-cover" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-foreground tracking-tight">SoSHSA</div>
              <div className="text-xs text-muted-foreground font-medium">University of The Gambia</div>
            </div>
          </Link>
          {/*==================== End of Logo ====================*/}

          {/*==================== Desktop Navigation ====================*/}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
          {/*==================== End of Desktop Navigation ====================*/}

          {/*==================== Mobile Menu Button ====================*/}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span className={`w-full h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span
                className={`w-full h-0.5 bg-foreground transition-all duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
          {/*==================== End of Mobile Menu Button ====================*/}
        </div>

        {/*==================== Mobile Menu ====================*/}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-border animate-in slide-in-from-top-2 duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-base font-medium text-foreground hover:text-primary hover:translate-x-2 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
        {/*==================== End of Mobile Menu ====================*/}
      </div>
    </nav>
  )
}

export default Navbar
