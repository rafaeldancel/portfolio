import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { profile, siteContent } from "@/content";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const sans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: "normal",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: "normal",
  display: "swap",
});

const title = `${profile.name} · ${siteContent.heroTitles[0]}`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description: siteContent.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description: siteContent.description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteContent.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <a className="skip-link" href="#main-content">
          {siteContent.skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
