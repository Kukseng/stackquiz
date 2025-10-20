import "next-auth";

declare module "next-auth" {
  interface Session {
    apiAccessToken: string | null;
    apiRefreshToken?: string | null;
    apiAccessTokenExpires?: number | null;
    userId?: string | null;
    isRegistered?: boolean;
    email?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    apiAccessToken?: string | null;
    apiRefreshToken?: string | null;
    apiAccessTokenExpires?: number | null;
    userId?: string | null;
    email?: string | null;
  }
}
