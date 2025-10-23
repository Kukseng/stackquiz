/**
 * Root Layout for StackQuiz
 * Handles metadata, SEO, structured data, and global styles.
 */

import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "StackQuiz | Live | StackQuiz",
  description:
    "Engage with organizers in real-time StackQuiz. Compete in live quizzes and test your knowledge!",
  metadataBase: new URL("https://stackquiz-two.vercel.app"),
  openGraph: {
    title: "StackQuiz | Real-time Quiz Platform",
    description:
      "Join live quizzes and compete with others instantly on StackQuiz.",
    url: "https://stackquiz-two.vercel.app",
    siteName: "StackQuiz",
    images: [
      {
        url: "https://stackquiz-two.vercel.app/logo-sq.png",
        width: 512,
        height: 512,
        alt: "StackQuiz Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@stackquiz",
    title: "StackQuiz | Live Quiz Platform",
    description:
      "Play, compete, and learn in real-time quizzes with StackQuiz.",
    images: ["https://stackquiz-two.vercel.app/logo-sq.png"],
  },
  icons: {
    icon: "/logo-sq.png",
    apple: "/logo-sq.png",
  },
  alternates: {
    canonical: "https://stackquiz-two.vercel.app",
    languages: {
      en: "https://stackquiz-two.vercel.app",
      km: "https://stackquiz-two.vercel.app/km",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
     <head>
  {/* Favicon & App Icons */}
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="apple-touch-icon" href="/logo-sq.png" />
  <link rel="manifest" href="/manifest.json" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://stackquiz-two.vercel.app" />

  {/* Verification Tags */}
  <meta
    name="google-site-verification"
    content="5LoLB2EkdDEg96hS9avM9OuqJX8E_hVpLCma3rAD77A"
  />
  <meta name="msvalidate.01" content="36597519DA34BDEA185B033DA0C5FD3A" />

  {/* Open Graph (Facebook, LinkedIn) */}
  <meta property="og:title" content="StackQuiz | Live Real-time Quiz Platform" />
  <meta
    property="og:description"
    content="Compete in live quizzes, test your knowledge, and see your score in real-time on StackQuiz."
  />
  <meta property="og:url" content="https://stackquiz-two.vercel.app" />
  <meta property="og:site_name" content="StackQuiz" />
  <meta property="og:type" content="website" />
  <meta
    property="og:image"
    content="https://stackquiz-two.vercel.app/logo-sq.png"
  />

  {/* Twitter Meta */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="StackQuiz | Live Real-time Quiz Platform" />
  <meta
    name="twitter:description"
    content="Join real-time quizzes and compete instantly on StackQuiz."
  />
  <meta
    name="twitter:image"
    content="https://stackquiz-two.vercel.app/logo-sq.png"
  />

  {/* Structured Data - Organization */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "StackQuiz",
        url: "https://stackquiz-two.vercel.app",
        logo: "https://stackquiz-two.vercel.app/logo-sq.png",
        sameAs: [
          "https://www.facebook.com/stackquiz",
          "https://twitter.com/stackquiz",
          "https://www.linkedin.com/company/stackquiz",
        ],
      }),
    }}
  />

  {/* Structured Data - Website */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "StackQuiz",
        url: "https://stackquiz-two.vercel.app",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://stackquiz-two.vercel.app/explore?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      }),
    }}
  />

  {/* Google Analytics */}
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-8680NV1H0J"
  />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-8680NV1H0J', {
          page_path: window.location.pathname,
        });
      `,
    }}
  />
</head>


      <body className="cosmic-bg overflow-hidden">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}