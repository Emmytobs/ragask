import NextAuth, { Session } from "next-auth"
import Google from "next-auth/providers/google"
import { ExtendedSession, IUser } from "./session";
import axios from "axios";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.jwt = account.id_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      const customSession = session as ExtendedSession;
      customSession.jwt = token.jwt as string;
      const host = process.env.NEXT_PUBLIC_BASE_URL;
      const userInDb: IUser = (await axios.get(`${host}/api/v1/users/${customSession.user?.email}`, {
        headers: {
          'Authorization': `Bearer ${customSession?.jwt}`
        }
      })).data
      customSession.user_info = userInDb
      return customSession as Session;
    }
  }
});