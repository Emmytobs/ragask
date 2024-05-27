import NextAuth, { Session } from "next-auth"
import Google from "next-auth/providers/google"
import { ExtendedSession } from "./session";


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
      return customSession as Session;
    }
  }
});