import { firebaseConfig } from "@/app/firebase";
import { IFile, ICreateFileApi } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import {  useState } from "react";
import useSWRMutation from "swr/mutation";
import { useSession } from "next-auth/react";

interface IFileUploadMutation extends ICreateFileApi {
  jwt?: string;
}

async function uploadFileRequest(url: string, { arg }: { arg: IFileUploadMutation  }) {
  const {jwt, ...rest} = arg;
  return fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify( rest ),
  }).then((res) => res.json());
}

export const useFileUpload = () => {
  const {data: session} = useSession()
  const [filesState, setFilesState] = useState<IFile[]>([]);

  const { trigger } = useSWRMutation(
    "http://localhost:8000/api/v1/documents/pdf/upload",
    uploadFileRequest
  );
  

  const onRemoveFileFromViewTab = (file: IFile) => {
    const updatedPdfFiles = filesState.filter((f) => f.name !== file.name);
    setFilesState(updatedPdfFiles);
  };

  const onFileUploaded = async (files: File[]) => {
    const filesWithStorageInfo: IFile[] = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudStorage(file);
        if (!result) {
          throw new Error("Failed to upload to cloud storage");
        }
        const { storage_url } = result;
        const { name, type, size } = file;

        const fileMetaData = {
          name,
          storage_id: firebaseConfig.storageBucket!,
          type,
          size,
        };
        const jwt = session?.jwt;
        if(jwt){
          const data = await trigger({...fileMetaData, jwt});
          return { ...fileMetaData, storage_url, id: data.document_id };
        }
        else{
          console.log("No jwt found");
        }
        return { ...fileMetaData, storage_url, id: null };
      })
    );
    setFilesState(filesWithStorageInfo);
    return { files: filesWithStorageInfo };
  };

  return { files: filesState, onFileUploaded, onRemoveFileFromViewTab };
};
