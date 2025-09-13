import "next-auth";

declare module "next-auth" {
  interface Session {
    apiAccessToken?: string;
    apiRefreshToken?: string;
  }

  interface JWT {
    apiAccessToken?: string;
    apiRefreshToken?: string;
    apiAccessTokenExpires?: number;
  }
}
