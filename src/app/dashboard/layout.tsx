<<<<<<< HEAD
import SidebarComponent from "@/components/dashboard/SidebarComponent";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
    <SidebarComponent/>
=======
import React, { ReactNode } from "react";
import SidebarComponent from "@/components/dashboard/SidebarComponent";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarComponent />
>>>>>>> db42276e9798746104d4e83b41fcf51f7ed9a845
      <main className="flex-1 lg:ml-0 ml-0 overflow-auto">
        {children}
      </main>
    </div>
<<<<<<< HEAD
  )
}
=======
  );
}
>>>>>>> db42276e9798746104d4e83b41fcf51f7ed9a845
