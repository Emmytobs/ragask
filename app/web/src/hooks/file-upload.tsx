import { firebaseConfig, firebaseStorage } from "@/app/firebase";
import { IFile, ICreateFileApi } from "@/interfaces/IFile";
import { uploadToCloudStorage } from "@/lib/storage-utils";
import {  useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { getDownloadURL, ref } from "firebase/storage";
import axios from "axios";

interface IFileUploadMutation extends ICreateFileApi {
  jwt?: string;
}

async function uploadFileRequest(
  url: string,
  { arg }: { arg: IFileUploadMutation }
) {
  const { jwt, ...rest } = arg;
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  }).then((res) => res.json());
}

export const useFileUpload = () => {
  const { data: session } = useSession();
  const [filesState, setFilesState] = useState<IFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/documents/upload`,
    uploadFileRequest
  );

  const { data, isLoading: isLastAccessedPdfsLoading } = useSWR(
    "documents/last-accessed"
  );
  useEffect(() => {
    if (data?.last_accessed_docs?.length > 0) {
      const loadDocs = async () => {
        const docs = await Promise.all(
          data.last_accessed_docs
            .filter(
              (doc: any) =>
                !filesState.some((existingDoc) => existingDoc.id === doc.id)
            )
            .map(async (doc: any) => ({
              ...doc,
              storage_url: await getDownloadURL(ref(firebaseStorage, doc.name)),
            }))
        );
        setFilesState((prev) => [...prev, ...docs]);
      };

      loadDocs();
    }
  }, [data]);

  useEffect(() => {
    if (session && pendingFiles.length > 0) {
      onFileUploaded(pendingFiles).then(() => {
        setPendingFiles([]);
      });
    }
  }, [session, pendingFiles]);

  const onRemoveFileFromViewTab = async (file: IFile) => {
    const updatedPdfFiles = filesState.filter((f) => f.name !== file.name);
    await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/documents/last-accessed/${file.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session?.jwt}`,
        },
      }
    );
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
        const data = await trigger({ ...fileMetaData, jwt: session.jwt });
        return { ...fileMetaData, storage_url, id: data.document_id };
      })
    );
    setFilesState(filesWithStorageInfo);
    return { files: filesWithStorageInfo };
  };

  return {
    files: filesState,
    onFileUploaded,
    onRemoveFileFromViewTab,
    isLastAccessedPdfsLoading,
  };
};
