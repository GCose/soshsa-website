import Link from "next/link"
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: "/about", label: "About Us" },
    { href: "/magazine", label: "Magazine" },
    { href: "/events", label: "Events" },
    { href: "/induction", label: "Induction" },
  ]

  const resources = [
    { href: "/resources/citation", label: "Citation Guide" },
    { href: "/news", label: "News" },
    { href: "https://portal.utg.edu.gm", label: "UTG Portal", external: true },
    { href: "https://utg.edu.gm", label: "UTG Website", external: true },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">SoSHSA</h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Social Sciences and Humanities Students' Association at the University of The Gambia. Promoting relevant
              education and student welfare.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) =>
                link.external ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-primary transition-colors hover:translate-x-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:soshsa@utg.edu.gm"
                  className="text-sm text-gray-300 hover:text-primary transition-colors"
                >
                  soshsa@utg.edu.gm
                </a>
              </li>
              <li className="text-sm text-gray-300">
                University of The Gambia
                <br />
                Brikama Campus
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© {currentYear} SoSHSA. All rights reserved.</p>
            <p className="text-sm text-gray-400">Designed with passion for students</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer