"use client";

import { DM_Sans } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import { LanguageProvider } from "../context/LanguageContext";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./globals.css";
import { StoreProvider } from "@/providers/StoreProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

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
      <body className="cosmic-bg overflow-hidden">
        <script
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
        <Provider store={store}>
          <SessionProvider>
            <QueryClientProvider client={queryClient}>
              <StoreProvider>
                <LanguageProvider>
                  <LayoutWrapper>{children}</LayoutWrapper>
                </LanguageProvider>
              </StoreProvider>
            </QueryClientProvider>
          </SessionProvider>
        </Provider>
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
