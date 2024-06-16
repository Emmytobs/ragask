import { firebaseStorage } from "@/app/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const uploadToCloudStorage = async (
    file: File
): Promise<{ storage_url: string } | undefined> => {
    const storageRef = ref(firebaseStorage, file.name);
    try {
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return { storage_url: url };
    } catch (error) {
        console.log({ error });
    }
};

export { uploadToCloudStorage }