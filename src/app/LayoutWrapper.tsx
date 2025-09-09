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
  const hiddenLayouts = ["/signup", "/dashboard","/dashboard/library", "/dashboard/report", "/dashboard/activity", "/dashboard/profile"];
  const hideLayout = hiddenLayouts.includes(pathname || "");

  return (
    <>
      {!hideLayout && <Navbar />}
      <ParticlesBackground />
      <StoreProvider>{children}</StoreProvider>
      {!hideLayout && <Footer />}
    </>
  );
}
