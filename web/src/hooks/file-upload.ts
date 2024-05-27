import { firebaseConfig } from "@/app/firebase";
import { IFile } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import useAxios from "@/hooks/useAxios";
import { useState } from "react";
import { useSession } from "next-auth/react";


export const useFileUpload = () => {
  const [files, setFiles] = useState<IFile[]>([]);
  const { axios } = useAxios()
  const {data: session} = useSession()


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
    await axios?.post('/files/upload', { files: newFiles })
    setFiles(newFiles);
    return { files: newFiles };
  };

  return { files, onFileUploaded };
};