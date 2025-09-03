
// src/app/dashboard/page.tsx
import React from "react";
import Layout from "../layout"; // or your Layout component path

export default function DashboardPage() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </Layout>
  );
}
