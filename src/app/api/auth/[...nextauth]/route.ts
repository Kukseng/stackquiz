// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";

/** API base for your backend (server-side) */
const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  (() => {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL must be set");
  })();


type OAuthRegisterBody = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
};


type OAuthRegisterFlat = {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn?: number | null;
  [k: string]: unknown;
};


type OAuthRegisterEnvelope = { data: OAuthRegisterFlat };


type OAuthRegisterResponse = OAuthRegisterFlat | OAuthRegisterEnvelope;


type MinimalProfile = {
  email?: string | null;
  given_name?: string | null;  
  family_name?: string | null; 
  first_name?: string | null;  
  last_name?: string | null;   
  name?: string | null;        
};

/** Extend the JWT we control during callbacks */
type TokenWithApi = JWT & {
  apiAccessToken?: string | null;
  apiRefreshToken?: string | null;
  apiAccessTokenExpires?: number | null;
  email?: string | null;
};

/** Extend the session we return to the client */
type SessionWithApi = Session & {
  apiAccessToken: string | null;
};

async function post(path: string, body: OAuthRegisterBody): Promise<Response> {
  const url = `${API_URL}/${path.replace(/^\/+/, "")}`;
  // Optional: console.log("[NextAuth] POST", url);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  });
  return res;
}

/** Type guard to pull flat payload out of an envelope-or-flat response */
function unwrapRegisterPayload(json: OAuthRegisterResponse): OAuthRegisterFlat {
  if (typeof json === "object" && json !== null && "data" in json) {
    const env = json as OAuthRegisterEnvelope;
    return env.data;
  }
  return json as OAuthRegisterFlat;
}

/** Safely split a name into first/last guesses */
function splitName(full?: string | null): { first: string; last: string } {
  const n = (full ?? "").trim();
  if (!n) return { first: "", last: "" };
  const parts = n.split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ") ?? "";
  return { first, last };
}

/** Clean username fallback */
function usernameFrom(email?: string | null, displayName?: string | null): string {
  if (displayName && displayName.trim().length > 0) return displayName.trim();
  if (email && email.includes("@")) return email.split("@")[0]!;
  return "user";
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
  ],

  callbacks: {
    async jwt({
      token,
      account,
      profile,
      user,
    }: {
      token: JWT;
      account: Record<string, unknown> | null;
      profile?: MinimalProfile | undefined;
      user?: User | undefined;
    }): Promise<JWT> {
      const t = token as TokenWithApi;

      // Initial OAuth sign-in: 'account' exists
      if (account) {
        const email: string | null =
          user?.email ?? profile?.email ?? t.email ?? null;

        if (email) {
          // Build best-effort names from provider profile
          const given =
            profile?.given_name ??
            profile?.first_name ??
            splitName(user?.name).first ??
            "";
          const family =
            profile?.family_name ??
            profile?.last_name ??
            splitName(user?.name).last ??
            "";
          const baseUsername = usernameFrom(email, user?.name ?? profile?.name ?? null);

          const payload: OAuthRegisterBody = {
            email,
            firstName: given,
            lastName: family,
            username: baseUsername,
          };

          try {
            const r = await post("auth/oauth/register", payload);
            

            if (r.ok) {
              const json = (await r.json()) as OAuthRegisterResponse;
              const flat = unwrapRegisterPayload(json);

              t.apiAccessToken = (typeof flat.accessToken === "string") ? flat.accessToken : null;
              t.apiRefreshToken = (typeof flat.refreshToken === "string") ? flat.refreshToken : null;
              t.apiAccessTokenExpires =
                Date.now() + ((typeof flat.expiresIn === "number" ? flat.expiresIn : 3600) * 1000);
              t.email = email;
            } else {
              
              t.apiAccessToken = null;
              t.apiRefreshToken = null;
              t.apiAccessTokenExpires = null;
            }
          } catch {
           
            t.apiAccessToken = null;
            t.apiRefreshToken = null;
            t.apiAccessTokenExpires = null;
          }
        }
      }

      return t;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      const t = token as TokenWithApi;
      const s: SessionWithApi = {
        ...session,
        apiAccessToken: t.apiAccessToken ?? null,
      };
      return s;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
