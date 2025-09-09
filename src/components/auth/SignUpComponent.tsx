"use client";

import React, { useState, FormEvent } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormField from "./FormField";
import { FaUser, FaEnvelope, FaKey } from "react-icons/fa";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import Image from "next/image";

// -------------------- Zod Schema --------------------
const signupSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
    firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    try {
      signupSchema.parse(formData);
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Service business logic error");

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            newErrors[String(issue.path[0])] = issue.message;
          }
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 lg:p-14">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl lg:border-8 border-white/70 transition-transform duration-500">
        {/* Left Side (desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 rounded-l-2xl bg-pink-100 relative overflow-hidden">
          {/* Logo */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo-sq.png"
                alt="Signup illustration"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="font-bold text-lg text-yellow-500">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          {/* Hero Image */}
          <div className="mt-12">
            <Image
              src="/signup.svg"
              alt="Signup illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right Side (form) */}
        <div className="flex-1 w-full md:w-1/2 p-4 md:px-10 py-8 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none">
          {/* Mobile logo */}
          <div className="flex justify-center items-center space-x-2 mb-4 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-yellow-500">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center md:text-left">
            Sign <span className="text-yellow-500">Up</span>
          </h2>
          <p className="text-gray-500 mt-1 text-center md:text-left">
            Create your personal account to get started.
          </p>

          {generalError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <FormField
              id="firstName"
              label="First Name"
              type="text"
              value={formData.firstName}
              placeholder="Doung"
              onChange={handleChange}
              error={errors.firstName}
              icon={<FaUser className="text-gray-400 h-5 w-5" />}
            />
            <FormField
              id="lastName"
              label="Last Name"
              type="text"
              value={formData.lastName}
              placeholder="Dara"
              onChange={handleChange}
              error={errors.lastName}
              icon={<FaUser className="text-gray-400 h-5 w-5" />}
            />
            <FormField
              id="username"
              label="Username"
              type="text"
              value={formData.username}
              placeholder="doungdara"
              onChange={handleChange}
              error={errors.username}
              icon={<FaUser className="text-gray-400 h-5 w-5" />}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              placeholder="doungdara@gmail.com"
              onChange={handleChange}
              error={errors.email}
              icon={<FaEnvelope className="text-gray-400 h-5 w-5" />}
            />

            <FormField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="S@%Dara12!@"
              onChange={handleChange}
              error={errors.password}
              icon={<FaKey className="text-gray-400 h-5 w-5" />}
              toggle={() => setShowPassword(!showPassword)}
              toggleIcon={
                showPassword ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400 cursor-pointer" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400 cursor-pointer" />
                )
              }
            />

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              placeholder="S@%Dara12!@"
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<FaKey className="text-gray-400 h-5 w-5" />}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              toggleIcon={
                showConfirmPassword ? (
                  <HiOutlineEyeOff className="h-5 w-5 text-gray-400 cursor-pointer" />
                ) : (
                  <HiOutlineEye className="h-5 w-5 text-gray-400 cursor-pointer" />
                )
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-text btn-secondary text-white font-semibold shadow-lg hover:opacity-90 transition-all duration-300"
            >
              {loading ? "Signing Up..." : "Create Account"}
            </button>
          </form>

          {/* Social login */}
          <div className="text-center my-4">
            <span className="text-gray-500">or</span>
          </div>
          <div className="flex justify-center space-x-6 mt-[-10px]">
            {["google", "fb", "github"].map((provider) => (
              <button
                key={provider}
                className="transition-transform duration-200 hover:scale-110"
              >
                <Image
                  src={`/social_media_icon/${provider}.svg`}
                  alt={`${provider} Icon`}
                  width={44}
                  height={44}
                />
              </button>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-2 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
