
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  console.log("==========Middleware is Running========");
  console.log("==> Next URL", req.url);
  console.log("==> Pathname", req.nextUrl.pathname);

  // Get token from cookies
  const refreshToken = req.cookies.get("next-auth.session-token")?.value;
  const isLoggedIn = !!refreshToken;

  const authRoutes = ['/login', '/signup'];
  const protectedRoutes = ['/dashboard'];

  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));

  console.log("==> Logged In:", isLoggedIn);
  console.log("==> Auth Route:", isAuthRoute);
  console.log("==> Protected Route:", isProtectedRoute);

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    console.log("==> Redirecting to dashboard");
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin));
  }

  // Redirect non-logged-in users away from protected pages
  if (isProtectedRoute && !isLoggedIn) {
    console.log("==> Redirecting to login");
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  return NextResponse.next();
}

// Routes to apply middleware
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
