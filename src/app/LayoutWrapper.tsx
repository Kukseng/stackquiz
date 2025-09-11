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

  // check if layout should be hidden
  const shouldHideLayout = (currentPath: string): boolean => {
    // Check exact paths
    if (LAYOUT_CONFIG.hiddenPaths.includes(currentPath)) {
      return true;
    }
    
    // Check path prefixes
    return LAYOUT_CONFIG.hiddenPathPrefixes.some(prefix => 
      currentPath.startsWith(prefix)
    );
    
    
  };

  const hideLayout = shouldHideLayout(pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <ParticlesBackground />
      <StoreProvider>{children}</StoreProvider>
      {!hideLayout && <Footer />}
    </>
  );
}