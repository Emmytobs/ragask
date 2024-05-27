import { firebaseConfig } from "@/app/firebase";
import { IFile } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";


export const useFileUpload = () => {
  const [files, setFiles] = useState<IFile[]>([]);
  const { axios } = useAxios()

  useEffect(() => {
    const uploadFiles = async () => {
      if (axios && files.length > 0) {
        await axios.post('/files/upload', { files });
      }
    };
    uploadFiles();
  }, [axios, files]);


  const onFileUploaded = async (files: File[]) => {
    const fileUrls: Array<Pick<IFile, "storage_url">> = await Promise.all(
      files.map(
        (file) => {
          return uploadToCloudStorage(file) as Promise<{ storage_url: string }>
        }
      )
    );

    const newFiles: IFile[] = files.map(({ name, type, size }, index) => ({
      name,
      storage_url: fileUrls[index].storage_url,
      is_indexed: false,
      storage_id: firebaseConfig.storageBucket!,
      type,
      size
    }));

    setFiles(newFiles);
    return { files: newFiles };
  };

  return { files, onFileUploaded };
};