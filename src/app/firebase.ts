import { FirebaseOptions, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import * as dotenv from "dotenv"

dotenv.config()

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);
