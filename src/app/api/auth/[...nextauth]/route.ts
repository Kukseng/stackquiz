import NextAuth, { DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { signIn } from "next-auth/react";
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
      FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
  }),
  ],
  callbacks: {
    async signIn({ user }: { user: DefaultUser }) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth-register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              username: user.email?.split("@")[0],
              firstName: user.name?.split(" ")[0],
              lastName: user.name?.split(" ")[1] || "",
              
            }),
          }
        );

        const data = await res.json();
        console.log("OAuth register response:", res.status, data);
      //  signIn("keycloak");
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
