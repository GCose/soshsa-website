
import Navbar from "./Navbar"
import Footer from "./Footer"
import type { ReactNode } from "react"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

export default Layout
