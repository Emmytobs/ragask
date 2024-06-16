import NextAuth, {  Session } from "next-auth";
import Google from "next-auth/providers/google";
import { IUser } from "@/session";
import axios from "axios";

let cachedSession: Session | null = null;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.jwt = account.id_token;
      }
      return token;
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