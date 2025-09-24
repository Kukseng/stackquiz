"use client";

import { useGetAllUsersQuery } from "@/lib/api/userApi";

export default function UsersPage() {
  const { data: users, isLoading, error } = useGetAllUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p className="text-red-500">
        Error fetching users: {"status" in error ? error.status : "Unknown error"}
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <ul className="space-y-2">
        {users?.map((u) => (
          <li
            key={u.id}
            className="p-3 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <span className="font-medium">
              {u.firstName} {u.lastName}
            </span>{" "}
            <span className="text-gray-500">({u.email})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
