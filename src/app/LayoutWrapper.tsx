"use client";
import { Navbar } from "@/components/navbar_footer/NavbarComponent";
import Footer from "@/components/navbar_footer/FooterComponent";
import ParticlesBackground from "@/components/ParticlesBackground";
import StoreProvider from "@/providers/StoreProvider";
import { usePathname } from "next/navigation";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // hide layout for signup and quiz-builder pages
  const hideLayout = pathname === "/signup" || pathname === "/quizbuilder";

  return (
    <>
      {!hideLayout && <Navbar />}
      <ParticlesBackground />
      <StoreProvider>{children}</StoreProvider>
      {!hideLayout && <Footer />}
    </>
  );
}
