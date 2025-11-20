import Head from "next/head";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const Layout = ({ children, title, description }: LayoutProps) => (
  <>
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </Head>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </>
);

export default Layout;
