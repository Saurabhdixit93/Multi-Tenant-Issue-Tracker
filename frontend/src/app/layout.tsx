import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "RUDRATEK V1 | Multi-Tenant Issue Tracker",
    template: "RUDRATEK V1 | %s",
  },
  description:
    "Professional Multi-Tenant Issue Tracking Protocol with Radical Design and AI-Powered Categorization. Secure, Isolated, Enterprise-Grade.",
  keywords: [
    "Issue Tracker",
    "Multi-Tenant",
    "Brutalist Design",
    "SaaS",
    "Developer Tools",
    "Secure Data Isolation",
    "RUDRATEK",
  ],
  authors: [{ name: "RUDRATEK Team" }],
  creator: "RUDRATEK Specialist",
  publisher: "RUDRATEK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "RUDRATEK V1",
    description:
      "Multi-Tenant Issue Tracker Protocol. Radical Design. Absolute Isolation.",
    url: "https://rudratek.v1",
    siteName: "RUDRATEK V1",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RUDRATEK V1",
    description:
      "The next generation of issue tracking. Brutalist aesthetic meet enterprise security.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "RUDRATEK V1",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  description: "Secure, Isolated, AI-Powered Multi-Tenant Issue Tracker",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  publisher: {
    "@type": "Organization",
    name: "RUDRATEK",
    logo: "https://rudratek.v1/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
