"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar_footer/NavbarComponent";
import Footer from "@/components/navbar_footer/FooterComponent";
import ParticlesBackground from "@/components/ParticlesBackground";
import StoreProvider from "@/providers/StoreProvider";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // hide layout for signup and quiz-builder pages
  const hideLayout = pathname === "/signup" || pathname === "/login" || pathname === "/verify-email" || pathname === "/quizbuilder" || pathname === "/leaderboard/playagain"||pathname === "/leaderboard/library"||pathname==="/leaderboard/poduim"||pathname==="/leaderboard"||pathname==="/leaderboard/explore"||pathname==="/leaderboard/favorite"||pathname==="/leaderboard/feedback"||pathname==="/leaderboard/summary";
  return (
    <>
      {!hideLayout && <Navbar />}
      <ParticlesBackground />
      <StoreProvider>{children}</StoreProvider>
      {!hideLayout && <Footer />}
    </>
  );
}
