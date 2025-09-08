"use client";
import Sidebar from "../../components/leaderboard/Sidebar"
import React from "react";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Main content first */}
      <main className="flex-1 p-6 ">{children}</main>

      {/* Sidebar on the right */}
      <div className="w-100">
        <Sidebar />
      </div>
    </div>
  );
}
