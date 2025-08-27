"use client"; // must be at the very top

import React from "react";
import SignupForm from "@/components/auth/SignUpComponent";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SignupPage() {
  const pathname = usePathname(); // e.g. "/signup"
  const searchParams = useSearchParams(); // query params
  const router = useRouter(); // navigate programmatically

  return (
      <SignupForm />
  );
}
