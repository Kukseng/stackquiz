"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HostRouteRedirect() {
  const params = useParams();
  const router = useRouter();
  const sessionCode = (params as any)?.sessionCode;

  useEffect(() => {
    if (sessionCode) {
      // Replace the URL so history isn't polluted with the redirect page
      router.replace(`/dashboard/host/${sessionCode}`);
    }
  }, [sessionCode, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-600">Redirecting to host dashboard…</div>
    </div>
  );
}
