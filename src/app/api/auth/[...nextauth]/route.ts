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
  console.log(`[NextAuth POST] Calling: ${url}`);
  console.log(`[NextAuth POST] Body:`, JSON.stringify(body, null, 2));
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
    console.log(`[NextAuth POST] Response status: ${res.status}`);
    if (!res.ok) {
      const errMsg = await res.text();
      console.error(
        `[NextAuth POST] API call failed: ${res.status} ${res.statusText} for ${url}\n${errMsg}`
      );
    }
    return res;
  } catch (error) {
    console.error(`[NextAuth] Network error calling ${url}:`, error);
    throw error;
  }
}

async function refreshAccessToken(refreshToken: string): Promise<any> {
  try {
    const base = resolveApiBase();
    const url = `${base}/auth/refresh`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "NextAuth-Client/1.0",
      },
      cache: "no-store",
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      console.error(
        `[NextAuth] Token refresh failed: ${res.status} ${res.statusText}`
      );
      return null;
    }

    const data = await res.json();
    const payload = data.data ?? data;
    return {
      accessToken: payload.accessToken ?? payload.access_token,
      refreshToken:
        payload.refreshToken ?? payload.refresh_token ?? refreshToken,
      expiresIn: payload.expiresIn ?? payload.expires_in ?? 3600,
    };
  } catch (error) {
    console.error("[NextAuth] Token refresh error:", error);
    return null;
  }
}

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://stackquiz-api.stackquiz.me/api/v1';
      const loginUrl = `${apiUrl}/auth/login`;
      
      console.log(`[CredentialsProvider] Attempting login to: ${loginUrl}`);
      console.log(`[CredentialsProvider] Username: ${credentials.username}`);
      
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
      });
      
      console.log(`[CredentialsProvider] Response status: ${res.status}`);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[CredentialsProvider] Login failed: ${res.status}`, errorText);
        return null;
      }
      
      const json = await res.json();
      
      // Handle both wrapped (ApiResponse) and direct response formats
      const data = json.data ?? json;
      
      console.log(`[CredentialsProvider] Response data:`, data);
      
      // Extract tokens - check both camelCase and snake_case
      const accessToken = data.access_token || data.accessToken;
      const refreshToken = data.refresh_token || data.refreshToken;
      
      if (!accessToken) {
        console.error(`[CredentialsProvider] No tokens in response`, data);
        return null;
      }

      console.log(`[CredentialsProvider] ✅ Login successful for ${credentials.username}`);
     
      return {
        id: data.email ?? data.id ?? credentials.username,
        name: data.name ?? data.username ?? credentials.username,
        email: data.email ?? null,
        accessToken: accessToken,
        refreshToken: refreshToken,
        apiAccessToken: accessToken,
        apiRefreshToken: refreshToken,
        expiresIn: data.expires_in || data.expiresIn || 3600,
        expiresAt: Date.now() + ((data.expires_in || data.expiresIn || 3600) * 1000),
      };
    } catch (e) {
      console.error("[CredentialsProvider] Login exception", e);
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
    async jwt({ token, account, profile, user, trigger }) {
      console.log(`[NextAuth JWT] Callback triggered:`, {
        trigger,
        hasAccount: !!account,
        provider: account?.provider,
        hasUser: !!user,
        hasProfile: !!profile,
        email: (user as any)?.email ?? (profile as any)?.email ?? (token as any)?.email,
      });
      
      // ✅ Handle token refresh when access token is expired
      if (trigger === "update" || (token && (token as any).apiAccessTokenExpires && Date.now() > (token as any).apiAccessTokenExpires)) {
        if ((token as any).apiRefreshToken) {
          try {
            console.log(`[NextAuth JWT] Token expired, attempting refresh...`);
            const refreshUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`;
            const res = await fetch(refreshUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh_token: (token as any).apiRefreshToken }),
            });
            
            if (res.ok) {
              const data = await res.json();
              const payload = data.data ?? data; // Handle wrapped response
              
              console.log(`[NextAuth JWT] ✅ Token refreshed successfully`);
              (token as any).apiAccessToken = payload.access_token || payload.accessToken;
              (token as any).apiRefreshToken = payload.refresh_token || payload.refreshToken;
              (token as any).apiAccessTokenExpires = Date.now() + ((payload.expires_in || 3600) * 1000);
              
              return token;
            } else {
              console.error(`[NextAuth JWT] ❌ Token refresh failed: ${res.status}`);
              // Clear tokens on refresh failure
              (token as any).apiAccessToken = null;
              (token as any).apiRefreshToken = null;
              (token as any).apiAccessTokenExpires = null;
              return token;
            }
          } catch (e) {
            console.error(`[NextAuth JWT] ❌ Token refresh exception:`, e);
            (token as any).apiAccessToken = null;
            (token as any).apiRefreshToken = null;
            (token as any).apiAccessTokenExpires = null;
            return token;
          }
        }
      }
   
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
          console.log(
            `[NextAuth] Calling backend:`,
            process.env.NEXT_PUBLIC_API_URL + "/auth/oauth/register"
          );
          const r = await post("auth/oauth/register", {
            email,
            firstName: givenName,
            lastName: familyName,
            username: baseUsername,
            provider,
          });
          
          console.log(`[NextAuth] Backend response status: ${r.status} ${r.statusText}`);
          
          if (r.ok) {
            const data = await r.json();
            console.log(`[NextAuth] Full response from backend:`, JSON.stringify(data, null, 2));
            
            // Backend wraps response in { data: {...} } or returns {...} directly
            const payload = (data as any).data ?? data;
            
            console.log(`[NextAuth] Extracted payload:`, JSON.stringify(payload, null, 2));
            
            // Extract tokens - check all possible field name variations
            const accessToken = payload.accessToken || payload.access_token || null;
            const refreshToken = payload.refreshToken || payload.refresh_token || null;
            const expiresIn = payload.expiresIn || payload.expires_in || 3600;
            const userId = payload.userId || payload.user_id || null;
            
            console.log(`[NextAuth] Parsed values:`, {
              accessToken: accessToken ? accessToken.substring(0, 20) + "..." : null,
              refreshToken: refreshToken ? refreshToken.substring(0, 20) + "..." : null,
              userId,
              expiresIn,
            });
            
            (token as any).apiAccessToken = accessToken;
            (token as any).apiRefreshToken = refreshToken;
            (token as any).apiAccessTokenExpires = Date.now() + expiresIn * 1000;
            (token as any).email = email;
            (token as any).userId = userId;
            
            console.log(`[NextAuth] ✅ Registration success for: ${email}`);
            console.log(`[NextAuth] Token summary:`, {
              hasAccessToken: !!(token as any).apiAccessToken,
              hasRefreshToken: !!(token as any).apiRefreshToken,
              userId: (token as any).userId,
              expiresAt: new Date((token as any).apiAccessTokenExpires),
            });
          } else {
            const errorText = await r.text();
            (token as any).apiAccessToken = null;
            (token as any).apiRefreshToken = null;
            (token as any).apiAccessTokenExpires = null;
            console.error(`[NextAuth] ❌ Registration API call failed`);
            console.error(`[NextAuth] URL: ${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/register`);
            console.error(`[NextAuth] Status: ${r.status} ${r.statusText}`);
            console.error(`[NextAuth] Request body:`, {
              email,
              firstName: givenName,
              lastName: familyName,
              username: baseUsername,
              provider,
            });
            console.error(`[NextAuth] Error response:`, errorText);
          }
        } catch (e) {
          (token as any).apiAccessToken = null;
          (token as any).apiRefreshToken = null;
          (token as any).apiAccessTokenExpires = null;
          console.error(`[NextAuth] ❌ Registration exception for: ${email}`, e);
        }
      } 
      
      // ✅ Handle Credentials provider login
      // On signIn, user object has tokens from authorize()
      if (user && (user as any).accessToken) {
        console.log(`[NextAuth] ✅ Found accessToken in user object`);
        console.log(`[NextAuth] User object:`, {
          id: (user as any).id,
          email: (user as any).email,
          hasAccessToken: !!(user as any).accessToken,
          hasRefreshToken: !!(user as any).refreshToken,
          expiresAt: new Date((user as any).expiresAt),
        });
        
        // Always use tokens from user object if they exist
        (token as any).apiAccessToken = (user as any).accessToken;
        (token as any).apiRefreshToken = (user as any).refreshToken;
        (token as any).apiAccessTokenExpires = (user as any).expiresAt || Date.now() + ((user as any).expiresIn || 3600) * 1000;
        (token as any).userId = (user as any).id;
        (token as any).email = (user as any).email;
        (token as any).name = (user as any).name;
        
        console.log(`[NextAuth JWT] ✅ Token updated from user:`, {
          hasApiAccessToken: !!(token as any).apiAccessToken,
          hasApiRefreshToken: !!(token as any).apiRefreshToken,
          userId: (token as any).userId,
          expiresAt: new Date((token as any).apiAccessTokenExpires),
        });
      }
      
      console.log(`[NextAuth JWT] Final token state:`, {
        hasApiAccessToken: !!(token as any).apiAccessToken,
        hasApiRefreshToken: !!(token as any).apiRefreshToken,
        userId: (token as any).userId,
        email: (token as any).email,
        isRegistered: !!(token as any).apiAccessToken,
      });
      
      return token;
    },
    async session({ session, token }) {
      console.log(`[NextAuth Session] Building session from token:`, {
        tokenHasApiAccessToken: !!(token as any).apiAccessToken,
        tokenHasApiRefreshToken: !!(token as any).apiRefreshToken,
        tokenUserId: (token as any).userId,
      });
      
      (session as any).apiAccessToken = (token as any).apiAccessToken ?? null;
      (session as any).apiRefreshToken = (token as any).apiRefreshToken ?? null;
      (session as any).userId = (token as any).userId ?? null;
      (session as any).isRegistered = !!(token as any).apiAccessToken;
      (session as any).email = (token as any).email ?? null;
      
      console.log(`[NextAuth Session] Final session state:`, {
        hasApiAccessToken: !!(session as any).apiAccessToken,
        hasApiRefreshToken: !!(session as any).apiRefreshToken,
        userId: (session as any).userId,
        isRegistered: (session as any).isRegistered,
      });
      
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 
