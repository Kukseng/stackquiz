/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Get the JWT token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !(token as any).apiRefreshToken) {
      return NextResponse.json(
        { error: "No refresh token available" },
        { status: 401 }
      );
    }

    // Prepare API request to refresh token
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API URL not configured");
    }

    const refreshUrl = `${apiUrl.replace(/\/+$/, "")}/auth/refresh`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NextAuth-Client/1.0",
      },
      body: JSON.stringify({
        refreshToken: (token as any).apiRefreshToken,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `[Token Refresh] API returned ${response.status}: ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const payload = data.data ?? data;

    // Return success - the actual token update happens via session update
    return NextResponse.json({
      success: true,
      accessToken: payload.accessToken ?? payload.access_token,
      refreshToken: payload.refreshToken ?? payload.refresh_token,
      expiresIn: payload.expiresIn ?? payload.expires_in ?? 3600,
    });
  } catch (error) {
    console.error("[Token Refresh API Route] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
