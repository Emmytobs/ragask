interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  subscription_details: string;
  last_accessed_pdfs: string[];
}

export { IUser };
