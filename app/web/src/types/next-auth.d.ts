import { IUser } from '@/session';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    jwt: string;
    user: IUser;
    error?: "RefreshAccessTokenError"
  }
}
 
declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number
    refresh_token: string
    error?: "RefreshAccessTokenError"
  }
}
