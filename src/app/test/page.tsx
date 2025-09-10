/* eslint-disable @typescript-eslint/no-explicit-any */
// components/RegisterForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRegisterMutation } from "@/lib/api/authApi";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmedPassword: "",
    firstName: "",
    lastName: "",
  });
  const [register, { isLoading, isError, error, isSuccess }] =
    useRegisterMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await register(formData).unwrap();
      console.log("Registration successful:", response);
      // Optionally redirect or show success message
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div>
          <label
            htmlFor="confirmedPassword"
            className="block text-sm font-medium"
          >
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmedPassword"
            id="confirmedPassword"
            value={formData.confirmedPassword}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
      {isSuccess && (
        <p className="mt-4 text-green-600">Registration successful!</p>
      )}
      {isError && (
        <p className="mt-4 text-red-600">
          Registration failed: {(error as any)?.data?.error || "Unknown error"}
        </p>
      )}
    </div>
  );
}
