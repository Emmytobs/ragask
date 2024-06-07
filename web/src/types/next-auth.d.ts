import { IUser } from '@/session';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    jwt: string;
    user: IUser;
  }
}