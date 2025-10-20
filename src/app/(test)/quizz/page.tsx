"use client";

import { useState } from "react";
import { useGetAllUsersQuery } from "@/lib/api/userApi";

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  role: string;
  isActive: boolean;
  lastActivity: string; // e.g., "3h ago"
}

export default function UsersTable() {
  const { data: users, isLoading, error } = useGetAllUsersQuery();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  if (isLoading) return <p className="animate-pulse">Loading users...</p>;
  if (error) return <p className="text-red-500">Error loading users</p>;

  const filteredUsers = users
    ?.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((u) =>
      roleFilter === "All" ? true : u.role.toLowerCase() === roleFilter.toLowerCase()
    )
    .filter((u) =>
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? u.isActive
        : !u.isActive
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <p className="mb-6 text-gray-500">Manage all users on the platform.</p>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users, quizzes..."
          className="border rounded-lg p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-lg p-2"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option>All</option>
          <option>User</option>
          <option>Organizer</option>
        </select>
        <select
          className="border rounded-lg p-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Banned</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Users</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Last activity</th>
            <th className="p-3 text-left">State</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((u, index) => (
            <tr key={u.id} className="border-t">
              <td className="flex items-center gap-3 p-3">
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl}
                    alt={`${u.firstName} ${u.lastName}`}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                    {u.firstName[0]}
                  </div>
                )}
                <span>{u.firstName} {u.lastName}</span>
              </td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">{u.lastActivity}</td>
              <td className={`p-3 font-medium ${
                u.isActive ? "text-green-600" : "text-red-600"
              }`}>
                {u.isActive ? "Active" : "Suspended"}
              </td>
              <td className="p-3 relative">
                <button className="px-3 py-1 border rounded-lg">•••</button>
                {/* Quick actions dropdown can be implemented with a menu component */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
