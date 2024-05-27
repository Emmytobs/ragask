import { firebaseConfig } from "@/app/firebase";
import { ICreateFile } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import useAxios from "@/hooks/useAxios";
import { useState } from "react";


export const useFileUpload = () => {
  const [filesState, setFilesState] = useState<ICreateFile[]>([]);
  const { axios } = useAxios()

  const uploadFiles = async (files: ICreateFile[]) => {
    if (files.length > 0) {
      await axios?.post('/files/upload', { files: [...files] });
    }
  };


  const onFileUploaded = async (files: File[]) => {
    const filesWithStorageInfo: ICreateFile[] = await Promise.all(
      files.map(
        async (file) => {
          const result = await uploadToCloudStorage(file);
          if (!result) {
            throw new Error("Failed to upload to cloud storage");
          }
          const { storage_url } = result;
          const { name, type, size } = file;

          return {
            name,
            storage_url,
            storage_id: firebaseConfig.storageBucket!,
            type,
            size
          };
        }
      )
    );
    await uploadFiles(filesWithStorageInfo)
    setFilesState(filesWithStorageInfo);
    return { files: filesWithStorageInfo };
  };

  return { files: filesState, onFileUploaded };
};