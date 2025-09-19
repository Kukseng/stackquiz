/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

/** Force runtime execution;  */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";


const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GH_CLIENT_ID",
  "GH_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(
      `[NextAuth Config] Missing required environment variable: ${varName}`
    );
  }
});

function resolveApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL must be set");
  }
  return base.replace(/\/+$/, "");
}

async function post(path: string, body: unknown) {
  const base = resolveApiBase();
  const url = `${base}/${String(path).replace(/^\/+/, "")}`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NextAuth-Client/1.0",
      },
      cache: "no-store",
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errMsg = await res.text();
      console.error(
        `API call failed: ${res.status} ${res.statusText} for ${url}\n${errMsg}`
      );
    }
    return res;
  } catch (error) {
    console.error(`[NextAuth] Network error calling ${url}:`, error);
    throw error;
  }
}

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
    }),
    GitHubProvider({
      clientId: process.env.GH_CLIENT_ID!,
      clientSecret: process.env.GH_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: { params: { scope: "public_profile,email" } },
    }),
 CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    if (!credentials?.username || !credentials?.password) return null;
    try {
      const res = await fetch('https://stackquiz-api.stackquiz.me/api/v1/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });
      if (!res.ok) return null;
      const json = await res.json();
      const data = json.data;
      if (!data || !data.access_token) return null; // login failed

      // Map backend -> NextAuth session fields
      return {
        id: data.email ?? credentials.username,
        name: data.name ?? credentials.username,
        email: data.email ?? null,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        apiAccessToken: data.access_token,
        apiRefreshToken: data.refresh_token,
        expiresIn: data.expires_in,
      };
    } catch (e) {
      console.error("[CredentialsProvider] Login failed", e);
      return null;
    }
  }
}),


  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
   
      const email =
        (user as any)?.email ??
        (profile as any)?.email ??
        (token as any)?.email ??
        null;
      if (account && email) {
        const givenName =
          (profile as any)?.given_name ??
          (profile as any)?.first_name ??
          (user as any)?.name?.split(" ")?.[0] ??
          "";
        const familyName =
          (profile as any)?.family_name ??
          (profile as any)?.last_name ??
          (user as any)?.name?.split(" ")?.slice(1).join(" ") ??
          "";
        const baseUsername =
          (token as any)?.name ?? (user as any)?.name ?? email.split("@")[0];
        const provider = account.provider;
        try {
          console.log(
            `[NextAuth] Registering user: ${email} with provider: ${provider}`
          );
          const r = await post("auth/oauth/register", {
            email,
            firstName: givenName,
            lastName: familyName,
            username: baseUsername,
            provider,
          });
          if (r.ok) {
            const data = await r.json();
            const payload = (data as any).data ?? data;
            (token as any).apiAccessToken = payload.accessToken ?? null;
            (token as any).apiRefreshToken = payload.refreshToken ?? null;
            (token as any).apiAccessTokenExpires =
              Date.now() + (payload.expiresIn ?? 3600) * 1000;
            (token as any).email = email;
            (token as any).userId = payload.userId ?? null;
            console.log(`[NextAuth] Registration API success for: ${email}`);
          } else {
            (token as any).apiAccessToken = null;
            (token as any).apiRefreshToken = null;
            (token as any).apiAccessTokenExpires = null;
            console.error(`[NextAuth] Registration failed for: ${email}`);
          }
        } catch (e) {
          (token as any).apiAccessToken = null;
          (token as any).apiRefreshToken = null;
          (token as any).apiAccessTokenExpires = null;
          console.error(`[NextAuth] Registration exception for: ${email}`, e);
        }
      } 
      if (user && (user as any).accessToken) {
        (token as any).apiAccessToken = (user as any).accessToken;
        (token as any).userId = (user as any).id;
        (token as any).email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).apiAccessToken = (token as any).apiAccessToken ?? null;
      (session as any).apiRefreshToken = (token as any).apiRefreshToken ?? null;
      (session as any).userId = (token as any).userId ?? null;
      (session as any).isRegistered = !!(token as any).apiAccessToken;
      (session as any).email = (token as any).email ?? null;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
