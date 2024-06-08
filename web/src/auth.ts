import NextAuth, { JWT, Session } from "next-auth";
import Google from "next-auth/providers/google";
import { IUser } from "@/session";
import axios from "axios";

let cachedSession: Session | null = null;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account }) {
      const customToken = token as JWT;
      const expires_at = customToken.expires_at as number;
      if (account) {
        const { access_token, id_token, expires_at, refresh_token } = account;
        customToken.accessToken = access_token;
        customToken.jwt = id_token;
        customToken.expires_at = expires_at;
        customToken.refresh_token = refresh_token;
        return token;
    } else if ( Date.now() < expires_at * 1000) {
      return token;
    }else{
      if(!customToken.refresh_token){ 
        throw new Error("No refresh token");
      }
      try {
        const response = await fetch("https://oauth2.googleapis.com/token", {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.AUTH_GOOGLE_ID!,
            client_secret: process.env.AUTH_GOOGLE_SECRET!,
            grant_type: "refresh_token",
            refresh_token: customToken.refresh_token!,
          }),
          method: "POST",
        })
        const responseTokens = await response.json()
        if (!response.ok) throw responseTokens

        return {
          ...token,
          access_token: responseTokens.access_token,
          expires_at: Math.floor(Date.now() / 1000 + (responseTokens.expires_in as number)),
          refresh_token: responseTokens.refresh_token ?? token.refresh_token,
        }
      } catch (error) {
        console.error("Error refreshing access token", error)
        return { ...token, error: "RefreshAccessTokenError" as const }
      }
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
