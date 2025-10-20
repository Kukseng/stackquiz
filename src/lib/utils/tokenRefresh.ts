/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSession, signOut } from "next-auth/react";

/**
 * Check if the current session's access token is about to expire
 * @param bufferTime Time in milliseconds before actual expiry to consider as "expiring"
 * @returns true if token is expired or expiring soon
 */
export async function isTokenExpiring(bufferTime: number = 5 * 60 * 1000): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session) return true;

    const expiryTime = (session as any)?.apiAccessTokenExpires;
    if (!expiryTime) return false;

    const now = Date.now();
    return now > expiryTime - bufferTime;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return false;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 * @returns Valid access token or null if refresh fails
 */
export async function getValidToken(): Promise<string | null> {
  try {
    const session = await getSession();
    if (!session || !(session as any)?.apiAccessToken) {
      return null;
    }

    const isExpiring = await isTokenExpiring();
    if (isExpiring) {
      console.log("Token is expiring, attempting to refresh...");
      // Call the refresh endpoint
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      });

      if (!response.ok) {
        console.error("Token refresh failed");
        // Sign out user if refresh fails
        await signOut({ redirect: false });
        return null;
      }

      // Get updated session after refresh
      const updatedSession = await getSession();
      return (updatedSession as any)?.apiAccessToken || null;
    }

    return (session as any).apiAccessToken;
  } catch (error) {
    console.error("Error getting valid token:", error);
    return null;
  }
}

/**
 * Retry a failed API call after token refresh
 * @param fn The API call function to retry
 * @returns The result of the API call
 */
export async function retryWithTokenRefresh<T>(
  fn: () => Promise<T>,
  maxRetries: number = 1
): Promise<T | null> {
  let lastError: any;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // If it's a 401 and we have retries left, try to refresh token
      if (
        error.status === 401 &&
        i < maxRetries &&
        (error as any)?.apiAccessToken
      ) {
        console.log("Got 401, attempting token refresh...");
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
        });

        if (!response.ok) {
          console.error("Token refresh failed");
          await signOut({ redirect: false });
          throw error;
        }

        // Continue to next retry with refreshed token
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
