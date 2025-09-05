import { DM_Sans } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="cosmic-bg overflow-hidden">
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
