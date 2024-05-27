import { Session } from "next-auth";
interface IUser {
   _id: string;
   name: string;
   email: string;
   avatar: string;
   subscription_details: string;
   last_accessed_pdfs: string[];
}
interface ExtendedSession extends Session {
    jwt?: string;
    user_info?: IUser
}

export { ExtendedSession, IUser }