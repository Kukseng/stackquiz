import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL must be set");
  })();

async function post(path: string, body: any) {
  // path MUST NOT start with '/' to avoid double slashes
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

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
    }),
    // ...other providers
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Run once on initial OAuth sign-in
      if (account && profile?.email) {
        try {
          const r = await post("auth/oauth/register", {
            email: profile.email,
            firstName: (profile as any).given_name ?? "",
            lastName: (profile as any).family_name ?? "",
            username: token.name ?? profile.email.split("@")[0],
          });

          console.log("[NextAuth] /auth/oauth/register status:", r.status);

          if (r.ok) {
            const data = await r.json();
            const payload = (data as any).data ?? data;

            (token as any).apiAccessToken = payload.accessToken ?? null;
            (token as any).apiRefreshToken = payload.refreshToken ?? null;
            (token as any).apiAccessTokenExpires =
              Date.now() + ((payload.expiresIn ?? 3600) * 1000);
          } else {
            const errTxt = await r.text().catch(() => "");
            console.error("[NextAuth] oauth/register failed:", r.status, errTxt);
            delete (token as any).apiAccessToken;
          }
        } catch (e) {
          console.error("[NextAuth] oauth/register error:", e);
          delete (token as any).apiAccessToken;
        }
      }

      // Optional refresh flow if you implement /auth/refresh
      const expires = (token as any).apiAccessTokenExpires as number | undefined;
      if ((token as any).apiAccessToken && expires && Date.now() > expires - 30_000) {
        try {
          const r = await post("auth/refresh", {
            refreshToken: (token as any).apiRefreshToken,
          });
          console.log("[NextAuth] /auth/refresh status:", r.status);
          if (r.ok) {
            const data = await r.json();
            (token as any).apiAccessToken = (data as any).accessToken;
            (token as any).apiAccessTokenExpires =
              Date.now() + (((data as any).expiresIn ?? 3600) * 1000);
            if ((data as any).refreshToken)
              (token as any).apiRefreshToken = (data as any).refreshToken;
          } else {
            delete (token as any).apiAccessToken;
            delete (token as any).apiRefreshToken;
            delete (token as any).apiAccessTokenExpires;
          }
        } catch {
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
export { handler as GET, handler as POST };
