"use client";

import { DM_Sans } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import { LanguageProvider } from "../context/LanguageContext";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

// Note: Kantumruy Pro font was removed from next/font/google imports because
// the Next font loader failed to fetch it from Google Fonts during build.
// We keep a CSS fallback in `globals.css` where `--font-kantumruy` is defined.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="cosmic-bg overflow-hidden">
        <Provider store={store}>
          <SessionProvider>
            <LanguageProvider>
              <LayoutWrapper>{children}</LayoutWrapper>
            </LanguageProvider>
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
