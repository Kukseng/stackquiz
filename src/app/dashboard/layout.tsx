import React, { ReactNode } from "react";
import SidebarComponent from "@/components/dashboard/SidebarComponent";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarComponent />
      <main className="flex-1 lg:ml-0 ml-0 overflow-auto">
        {children}
      </main>
    </div>
  );
}
