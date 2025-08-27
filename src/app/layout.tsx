// layout.tsx (Server Component)
import { DM_Sans } from "next/font/google";
import LayoutWrapper from "./LayoutWrapper"; // Client Component
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });

export const metadata = {
  title: "StackQuizz - Real-time Quiz Platform",
  description: "Engage with organizer real-time StackQuizz. Compete in live quizzes!",
};

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
