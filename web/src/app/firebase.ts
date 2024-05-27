import { FirebaseOptions, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import * as dotenv from "dotenv"

dotenv.config()

const firebaseConfig: FirebaseOptions = {
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!
}


const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);


export { firebaseConfig, firebaseStorage }