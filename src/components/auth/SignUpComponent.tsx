'use client'
import React, { useState, FormEvent } from 'react';
import { z } from 'zod';
import Image from 'next/image';
import Link from "next/link";

// Zod Schema for form validation
const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string().min(8, { message: "Confirm password must be at least 8 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type User = {
  email: string;
  username: string;
  id: number;
};

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// Eye icons for password toggle
const eyeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 cursor-pointer">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const eyeOffIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 cursor-pointer">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.75 9.75 0 0 0 5.36-1.66"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

// Main Signup Form Component
const SignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setUser(null);

    try {
      signupSchema.parse(formData);
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newUser: User = { email: formData.email, username: formData.username, id: Date.now() };
      setUser(newUser);
      setLoading(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of err.issues) {
          newErrors[issue.path[0] as string] = issue.message;
        }
        setErrors(newErrors);
      } else {
        setGeneralError("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-2 lg:p-14">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl lg:border-8 border-white/70 transition-transform duration-500">

        {/* Left Side: Desktop only */}
        <div className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 p-8 rounded-l-2xl bg-pink-100 relative overflow-hidden">
          <div className="w-4/5">
            <Image src="/signup.svg" alt="Signup Illustration" width={500} height={500} />
          </div>
          <div className="p-1.5 absolute top-4 left-4 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={40} height={50} />
              <span className="font-bold text-yellow text-lg">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 w-full md:w-1/2 p-4 md:px-10 py-8 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none">
          
          {/* Mobile logo */}
          <div className="flex justify-center items-center space-x-2 mb-4 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={50} height={50} />
              <span className="font-bold text-yellow text-2xl">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-2 text-center md:text-left mt-[-10px]">
            <h2 className="text-2xl font-extrabold text-gray-800">
              Sign <span className="text-yellow">Up</span>
            </h2>
            <p className="text-gray-500 mt-1">Create your personal account to get started.</p>
          </div>

          {/* Success & Error */}
          {user && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4 text-center" role="alert">
            <p className="font-bold">Success!</p>
            <p className="text-sm">Welcome, {user.username}.</p>
          </div>}
          {generalError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-center" role="alert">
            <p className="font-bold">Error</p>
            <p className="text-sm">{generalError}</p>
          </div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-1 text-[14px]">Username</label>
              <div className="relative">
                <input type="text" name="username" id="username" value={formData.username} onChange={handleChange}
                  placeholder="doungdara"
                  className="w-full pl-12 pr-4 py-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Image src="/user.svg" alt="User Icon" width={17} height={17} />
                </div>
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-[14px]">Email</label>
              <div className="relative">
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
                  placeholder="doungdara@gmail.com"
                  className="w-full pl-12 pr-4 py-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Image src="/mail.svg" alt="Mail Icon" width={17} height={17} />
                </div>
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1 text-[14px]">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" id="password" value={formData.password} onChange={handleChange}
                  placeholder="S@%Dara12!@"
                  className="w-full pl-12 pr-12 py-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Image src="/key.svg" alt="Key Icon" width={17} height={17} />
                </div>
                <div onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                  {showPassword ? eyeOffIcon : eyeIcon}
                </div>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1 text-[14px]">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="S@%Dara12!@" className="w-full pl-12 pr-12 py-2 rounded-xl border border-amber-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Image src="/key.svg" alt="Key Icon" width={17} height={17} />
                </div>
                <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                  {showConfirmPassword ? eyeOffIcon : eyeIcon}
                </div>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl  btn-secondary btn-text font-semibold shadow-lg transition-all duration-300">
              {loading ? 'Signing Up...' : 'Create Account'}
            </button>
          </form>

          {/* Social login */}
          <div className="text-center my-4 mt-[-0px]">
            <span className="text-gray-500">or</span>
          </div>
          <div className="flex justify-center space-x-6 mt-[-10px]">
            <button className="transition-transform duration-200 hover:scale-110">
              <Image src="/google.svg" alt="Google Icon" width={50} height={50} />
            </button>
            <button className="transition-transform duration-200 hover:scale-110">
              <Image src="/facebook.svg" alt="Facebook Icon" width={44} height={44} />
            </button>
            <button className="transition-transform duration-200 hover:scale-110">
              <Image src="/github.svg" alt="Github Icon" width={44} height={44} />
            </button>
          </div>

          <p className="text-center text-gray-500 mt-2 text-sm">
            Already have an account? <Link href="#" className="text-indigo-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
