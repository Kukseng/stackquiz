// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL must be set");
  })();

async function post(path: string, body: any) {
  const url = `${API_URL}/${path.replace(/^\/+/, "")}`;
  console.log("[NextAuth] POST", url);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  return res;
}

// ❌ DON'T export this from a route file
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
  ],
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
          (token as any)?.name ??
          (user as any)?.name ??
          email.split("@")[0];

        try {
          const r = await post("auth/oauth/register", {
            email,
            firstName: givenName,
            lastName: familyName,
            username: baseUsername,
          });

          console.log("[NextAuth] /auth/oauth/register status:", r.status);

          if (r.ok) {
            const data = await r.json();
            const payload = (data as any).data ?? data;

            (token as any).apiAccessToken = payload.accessToken ?? null;
            (token as any).apiRefreshToken = payload.refreshToken ?? null;
            (token as any).apiAccessTokenExpires =
              Date.now() + ((payload.expiresIn ?? 3600) * 1000);
            (token as any).email = email;
          } else {
            const errTxt = await r.text().catch(() => "");
            console.error("[NextAuth] oauth/register failed:", r.status, errTxt);
            delete (token as any).apiAccessToken;
            delete (token as any).apiRefreshToken;
            delete (token as any).apiAccessTokenExpires;
          }
        } catch (e) {
          console.error("[NextAuth] oauth/register error:", e);
          delete (token as any).apiAccessToken;
          delete (token as any).apiRefreshToken;
          delete (token as any).apiAccessTokenExpires;
        }
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).apiAccessToken = (token as any).apiAccessToken ?? null;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// ✅ Only export HTTP handlers (and allowed special exports if needed)
export { handler as GET, handler as POST };
