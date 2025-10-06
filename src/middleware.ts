// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  console.log("==========Middleware is Running========");
  console.log("==> Next URL", req.url);
  console.log("==> Pathname", req.nextUrl.pathname);

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  const authRoutes = ['/login', '/signup'];
  const protectedRoutes = ['/dashboard'];

  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  console.log("==> Logged In:", isLoggedIn);
  console.log("==> Auth Route:", isAuthRoute);
  console.log("==> Protected Route:", isProtectedRoute);

  if (isAuthRoute && isLoggedIn) {
    console.log("==> Redirecting to dashboard");
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  }

  if (isProtectedRoute && !isLoggedIn) {
    console.log("==> Redirecting to login");
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
