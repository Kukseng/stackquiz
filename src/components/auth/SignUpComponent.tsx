'use client';

import React, { useState, FormEvent } from 'react';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FormField from './FormField'; // make sure this file exists

// -------------------- Zod Schema --------------------
const signupSchema = z
  .object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Confirm password must be at least 8 characters' }),
    firstName: z.string().min(2, { message: 'First name is required' }),
    lastName: z.string().min(2, { message: 'Last name is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

// -------------------- Eye Icons --------------------
export const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 cursor-pointer">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-400 cursor-pointer">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.75 9.75 0 0 0 5.36-1.66" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

// -------------------- Signup Form --------------------
const SignupForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Service business logic error');

      router.push('/dashboard');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError('An unexpected error occurred.');
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
          {/* logo + name in top-left of left side */}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo-sq.png" alt="Logo" width={40} height={40} />
              <span className="font-bold text-yellow text-lg">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          <div className="w-6/5">
            <Image src="/signup.svg" alt="Signup Illustration" width={500} height={500} />
          </div>
        </div>

        {/* Right Side (form) */}
        <div className="flex-1 w-full md:w-1/2 p-4 md:px-10 py-8 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none">

          {/* Mobile logo + name (visible on small screens) */}
          <div className="flex justify-center items-center space-x-2 mb-4 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo-sq.png" alt="Logo" width={48} height={48} />
              <span className="font-bold text-yellow text-2xl">
                <span className="text-blue-950">STACK</span>QUIZ
              </span>
            </Link>
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800 mb-2 text-center md:text-left">
            Sign <span className="text-yellow">Up</span>
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
            <FormField id="firstName" label="First Name" type="text" value={formData.firstName} placeholder="Doung" onChange={handleChange} error={errors.firstName} icon="/user.svg" />
            <FormField id="lastName" label="Last Name" type="text" value={formData.lastName} placeholder="Dara" onChange={handleChange} error={errors.lastName} icon="/user.svg" />
            <FormField id="username" label="Username" type="text" value={formData.username} placeholder="doungdara" onChange={handleChange} error={errors.username} icon="/user.svg" />
            <FormField id="email" label="Email" type="email" value={formData.email} placeholder="doungdara@gmail.com" onChange={handleChange} error={errors.email} icon="/mail.svg" />

            <FormField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              placeholder="S@%Dara12!@"
              onChange={handleChange}
              error={errors.password}
              icon="/key.svg"
              toggle={() => setShowPassword(!showPassword)}
              toggleIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
            />

            <FormField
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              placeholder="S@%Dara12!@"
              onChange={handleChange}
              error={errors.confirmPassword}
              icon="/key.svg"
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              toggleIcon={showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            />

            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl btn-secondary btn-text font-semibold shadow-lg transition-all duration-300">
              {loading ? 'Signing Up...' : 'Create Account'}
            </button>
          </form>

          {/* Social login */}
          <div className="text-center my-4">
            <span className="text-gray-500">or</span>
          </div>
          <div className="flex justify-center space-x-6 mt-[-10px]">
            {['google', 'fb', 'github'].map((provider) => (
              <button key={provider} className="transition-transform duration-200 hover:scale-110">
                <Image src={`/social_media_icon/${provider}.svg`} alt={`${provider} Icon`} width={44} height={44} />
              </button>
            ))}
          </div>

          <p className="text-center text-gray-500 mt-2 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
