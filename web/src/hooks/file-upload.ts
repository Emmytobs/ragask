import { firebaseConfig } from "@/app/firebase";
import { IFile, ICreateFileApi } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import useAxios from "@/hooks/useAxios";
import { useState } from "react";


export const useFileUpload = () => {
  const [filesState, setFilesState] = useState<IFile[]>([]);
  const { axios } = useAxios()

  const postFileToApi = async (file: ICreateFileApi) => {
      await axios?.post('/documents/pdf/upload', {...file});
  };


  const onFileUploaded = async (files: File[]) => {
    const filesWithStorageInfo: IFile[] = await Promise.all(
      files.map(
        async (file) => {
          const result = await uploadToCloudStorage(file);
          if (!result) {
            throw new Error("Failed to upload to cloud storage");
          }
          const { storage_url } = result;
          const { name, type, size } = file;

          const fileMetaData =  {
            name,
            storage_id: firebaseConfig.storageBucket!,
            type,
            size
          };
          await postFileToApi(fileMetaData)
          return {...fileMetaData, storage_url}
        }
      )
    );
    setFilesState(filesWithStorageInfo);
    return { files: filesWithStorageInfo };
  };

  return { files: filesState, onFileUploaded };
};