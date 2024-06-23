import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import { IUser } from "@/session";
import axios from "axios";

let cachedSession: Session | null = null;

const SECOND_IN_MILLISECONDS = 1000;

const refreshGoogleAccessToken = async (token: JWT) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refresh_token as string,
      }),
      method: "POST",
    });

    const responseTokens = await response.json();

    if (!response.ok) throw responseTokens;

    return {
      ...token,
      jwt: responseTokens.id_token,
      access_token: responseTokens.access_token,
      expires_at: Math.floor(
        Date.now() / 1000 + (responseTokens.expires_in as number)
      ),
      refresh_token: responseTokens.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: { params: { access_type: "offline", prompt: "consent" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token!;
        token.jwt = account.id_token;
        token.expires_at = account.expires_at!;
        token.refresh_token = account.refresh_token!;
        return token;
      } else if (Date.now() < token.expires_at * SECOND_IN_MILLISECONDS) {
        console.log("Token is still valid");
        return token;
      } else {
        if (!token.refresh_token) {
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
        console.log("Refreshing token");
        return refreshGoogleAccessToken(token);
      }
    },
    async session({ session, token, user }) {
      if (cachedSession && cachedSession.user?.email === session.user?.email) {
        return cachedSession;
      }

      session.jwt = token.jwt as string;
      const host = process.env.NEXT_PUBLIC_BASE_URL;
      const userInDb: IUser = (
        await axios.get(`${host}/api/v1/users/${session.user?.email}`, {
          headers: {
            Authorization: `Bearer ${session.jwt}`,
          },
        })
      ).data;
      session.user = { ...userInDb, ...session.user };

      cachedSession = session;
      return session;
    },
  },
});
