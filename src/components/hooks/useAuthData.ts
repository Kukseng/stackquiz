import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuthData() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // Invalidate all queries when session changes
  useEffect(() => {
    if (status === "authenticated") {
      queryClient.invalidateQueries();
    }
  }, [status, queryClient]);

  return {
    session,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    apiAccessToken: (session as any)?.apiAccessToken,
    userId: (session as any)?.userId,
  };
}

// Example: Fetch user data with auth token
export function useUserData() {
  const { session, isAuthenticated, apiAccessToken } = useAuthData();

  return useQuery({
    queryKey: ["userData", (session as any)?.userId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
    enabled: isAuthenticated && !!apiAccessToken,
    staleTime: 0, // Always fetch fresh
  });
}

// Example: Fetch dashboard data
export function useDashboardData() {
  const { isAuthenticated, apiAccessToken } = useAuthData();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${apiAccessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard data");
      return res.json();
    },
    enabled: isAuthenticated && !!apiAccessToken,
    refetchOnMount: true,
    staleTime: 0,
  });
}