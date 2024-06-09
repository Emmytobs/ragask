import { firebaseConfig } from "@/app/firebase";
import { IFile, ICreateFileApi } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import {  useEffect, useState } from "react";
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
  const {data: session} = useSession();
  const [filesState, setFilesState] = useState<IFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/documents/pdf/upload`,
    uploadFileRequest
  );


  useEffect(() => {
    if (session && pendingFiles.length > 0) {
      onFileUploaded(pendingFiles).then(() => {
        setPendingFiles([]); 
      });
    }
  }, [session, pendingFiles]);

  const onRemoveFileFromViewTab = (file: IFile) => {
    const updatedPdfFiles = filesState.filter((f) => f.name !== file.name);
    setFilesState(updatedPdfFiles);
  };

  const onFileUploaded = async (files: File[]) => {
    if (!session?.jwt) {
      setPendingFiles(files); 
      return { files: [] };
    }

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
        const data = await trigger({...fileMetaData, jwt: session.jwt});
        return { ...fileMetaData, storage_url, id: data.document_id };
      })
    );
    setFilesState(filesWithStorageInfo);
    return { files: filesWithStorageInfo };
  };

  return { files: filesState, onFileUploaded, onRemoveFileFromViewTab };
};