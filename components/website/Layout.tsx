import Head from "next/head";
import Navbar from "./Navigation";
import Footer from "./Footer";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalUrl?: string;
}

const Layout = ({
  children,
  title,
  description = "Social Sciences and Humanities Students' Association - University of The Gambia. Empowering students through academic excellence, community engagement, and professional development.",
  keywords = "SoSHSA, UTG, University of The Gambia, Social Sciences, Humanities, Student Association, Gambia, Education, Student Organization, Academic Excellence",
  ogImage = "/images/logo.jpeg",
  ogType = "website",
  author,
  publishedTime,
  modifiedTime,
  canonicalUrl,
}: LayoutProps) => {
  const siteUrl = "https://soshsa.vercel.app";
  const fullOgImage = ogImage?.startsWith("http")
    ? ogImage
    : `${siteUrl}${ogImage}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        {author && <meta name="author" content={author} />}

        {canonicalUrl && (
          <link rel="canonical" href={`${siteUrl}${canonicalUrl}`} />
        )}

        <meta property="og:type" content={ogType} />
        <meta
          property="og:url"
          content={canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={fullOgImage} />
        <meta property="og:site_name" content="SoSHSA" />
        <meta property="og:locale" content="en_US" />

        {ogType === "article" && (
          <>
            {publishedTime && (
              <meta property="article:published_time" content={publishedTime} />
            )}
            {modifiedTime && (
              <meta property="article:modified_time" content={modifiedTime} />
            )}
            {author && <meta property="article:author" content={author} />}
            <meta property="article:section" content="Education" />
            <meta property="article:tag" content="Student Association" />
          </>
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl}
        />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />

        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta name="geo.region" content="GM" />
        <meta name="geo.placename" content="Brikama, The Gambia" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 mt-15">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
