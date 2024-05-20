import { FirebaseOptions, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig: FirebaseOptions = {
  storageBucket: "gs://docuask-9590c.appspot.com", // TODO: Make this an env var
};

const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);
