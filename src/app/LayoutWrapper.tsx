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

// Configuration for layout visibility
const LAYOUT_CONFIG = {
  // Exact paths where layout should be hidden
  hiddenPaths: [
    "/signup",
    "/login",
    "/verify-email", 
    "/quizbuilder",
  ],
  
  // Path prefixes that should hide layout (matches all subroutes)
  hiddenPathPrefixes: [
    "/dashboard",
    "/leaderboard",
  ],
  
 
};

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // pages where layout should be visible
  const showLayouts = ["/", "/explore", "/join-room", "/about"];
  const showLayout = showLayouts.includes(pathname || "");

  return (
    <>
      {showLayout && <Navbar />}
      {showLayout && <ParticlesBackground />}
      <StoreProvider>{children}</StoreProvider>
      {showLayout && <Footer />}
    </>
  );
}