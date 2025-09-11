/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
// import { signIn } from "next-auth/react";
const authOptions = {
  secret: process.env.NEXTAUTH_SECRET, 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GH_CLIENT_ID!,
      clientSecret: process.env.GH_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: DefaultUser }) {
      try {
        const fullName = user.name || user.email?.split("@")[0] || "User";
        const firstName = fullName.split(" ")[0] || "User";
        const lastName = fullName.split(" ")[1] || "Anonymous";

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              username: user.email?.split("@")[0],
              firstName,
              lastName,
            }),
            credentials: "include",
          }
        );

        
        let data: any = null;
        try {
          data = await res.json();
        } catch (e) {
          console.warn("No JSON returned from OAuth register API");
        }

        console.log("OAuth register response:", res.status, data);
        return res.ok;
      } catch (err) {
        console.error("OAuth registration failed:", err);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
