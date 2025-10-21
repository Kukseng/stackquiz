/**
 * Server-only Root Layout
 * This file handles all metadata and server-side configuration
 * Keep this as a Server Component (no 'use client')
 */

import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { baseMetadata } from "@/config/metadata";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

// Note: Kantumruy Pro font was removed from next/font/google imports because
// the Next font loader failed to fetch it from Google Fonts during build.
// We keep a CSS fallback in `globals.css` where `--font-kantumruy` is defined.

/**
 * Server-side metadata configuration
 * This is the source of truth for all page metadata
 */
export const metadata: Metadata = baseMetadata;

/**
 * Viewport configuration for better mobile experience
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

/**
 * Root layout component
 * This is a server component that handles HTML structure and metadata
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            refetchOnReconnect: true,
            staleTime: 0, // Always fetch fresh data
            retry: 1,
          },
        },
      })
  );

  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://stackquiz-two.vercel.app" />

        {/* DNS prefetch for API domain */}
        <link rel="dns-prefetch" href="https://api.stackquiz.me" />

        {/* Canonical URL (can be overridden by page-level metadata) */}
        <link rel="canonical" href="https://stackquiz-two.vercel.app" />

        {/* Mobile app meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="StackQuiz" />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Microsoft specific */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Language alternatives */}
        <link rel="alternate" hrefLang="en" href="https://stackquiz.me" />
        <link rel="alternate" hrefLang="km" href="https://stackquiz.me/km" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://stackquiz.me"
        />

        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "StackQuiz",
              url: "https://stackquiz-two.vercel.app",
              logo: "https://stackquiz-two.vercel.app/logo.png",
              description: "Interactive Real-time Quiz Platform",
              sameAs: [
                "https://www.facebook.com/stackquiz",
                "https://twitter.com/stackquiz",
                "https://www.linkedin.com/company/stackquiz",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Support",
                email: "support@stackquiz.me",
              },
            }),
          }}
        />

        {/* JSON-LD Structured Data for Website */}
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

        {/* Google Search Console verification - Update with your code */}
        <meta name="google-site-verification" content="5LoLB2EkdDEg96hS9avM9OuqJX8E_hVpLCma3rAD77A" />

        {/* Bing WebMaster Tools - Update with your code */}
        <meta name="msvalidate.01" content="36597519DA34BDEA185B033DA0C5FD3A" />

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

        {/* SEO Meta Tags */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Security headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>

      <body className="cosmic-bg overflow-hidden">
        {/* Prevent React DevTools semver runtime error when an empty version string is registered.
            Some devtools shims register a renderer with an empty version which breaks
            a semver check in the devtools bundle. We sanitize entries early. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
                if (hook && typeof hook.registerRendererInterface === 'function') {
                  const original = hook.registerRendererInterface;
                  hook.registerRendererInterface = function (id, renderer) {
                    try {
                      if (renderer && typeof renderer.version === 'string' && renderer.version.trim() === '') {
                        renderer = { ...renderer, version: '0.0.0' };
                      }
                    } catch (e) {}
                    return original.call(this, id, renderer);
                  };
                }
              } catch (e) {}
            `,
          }}
        />

        {/* Client-side providers wrapper */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

// import type { Metadata } from "next"
// import { DM_Sans, Kantumruy_Pro } from "next/font/google"
// import "./globals.css"
// import Providers from "./Providers"   // new file
// import { Toaster } from "@/components/ui/toaster"

// const dmSans = DM_Sans({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-dm-sans",
// })

// const kantumruyPro = Kantumruy_Pro({
//   subsets: ["khmer"],
//   display: "swap",
//   variable: "--font-kantumruy",
// })

// export const metadata: Metadata = {
//   title: "StackQuiz - Interactive Real-time Quiz Platform",
//   description:
//     "Create and participate in engaging real-time quizzes with live leaderboards and instant feedback",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" className={`${dmSans.variable} ${kantumruyPro.variable} antialiased`}>
//       <body className="cosmic-bg overflow-hidden">
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   )
// }
