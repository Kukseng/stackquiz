"use client";

import { DM_Sans, Kantumruy_Pro } from "next/font/google";
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

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer"],
  display: "swap",
  variable: "--font-kantumruy",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${kantumruyPro.variable} antialiased`}
    >
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
