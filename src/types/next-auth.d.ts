// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
    };
    apiAccessToken?: string;
    apiRefreshToken?: string;
    userId?: string;
    isRegistered?: boolean;
    error?: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    accessToken?: string;
    apiAccessToken?: string;
    apiRefreshToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }

  /**
   * Usually contains information about the provider being used
   * and also extends `TokenSet`, which is different tokens returned by OAuth Providers.
   */
  interface Account {
    provider: string;
    type: string;
    providerAccountId: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    id_token?: string;
    scope?: string;
    token_type?: string;
  }

  /**
   * The OAuth profile returned from your provider
   */
  interface Profile {
    sub?: string;
    name?: string;
    email?: string;
    image?: string;
    given_name?: string;
    family_name?: string;
    first_name?: string;
    last_name?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
    apiAccessToken?: string;
    apiRefreshToken?: string;
    apiAccessTokenExpires?: number;
    userId?: string;
    error?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }
}