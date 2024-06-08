import { IUser } from '@/session';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    jwt: string;
    user: IUser;
    error?: "RefreshAccessTokenError"
  }
  interface JWT {
    accessToken?: string;
    jwt?: string;
    expires_at?: number;
    refresh_token?: string; 
    error?: "RefreshAccessTokenError"
  }
}

