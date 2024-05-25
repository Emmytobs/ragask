"use client";

import SideNav from "../components/sideNav";
import ChatWindow from "../components/chatWindow";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfTabs } from "../components/PdfTabs";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage, firebaseConfig } from "./firebase";
import { FileDropzone } from "@/components/FileDropZone";

export type PDFFile = {
  name: string;
  url: string;
};

const uploadToCloudStorage = async (
  file: File
): Promise<{ url: string } | undefined> => {
  const storageRef = ref(firebaseStorage, file.name);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url };
  } catch (error) {
    console.log({ error });
  }
};

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);

  const onFileUploaded = async (files: File[]) => {
    const fileUrls: Array<Pick<PDFFile, "url">> = await Promise.all(
      files.map(
        (file) => uploadToCloudStorage(file) as Promise<{ url: string }>
      )
    );

    const pdfFiles: PDFFile[] = files.map(({ name, type, size }, index) => ({
      name,
      url: fileUrls[index].url,
      is_indexed: false,
      storage_id: firebaseConfig.storageBucket,
      type,
      size
    }));

    setPdfFiles(pdfFiles);
  };

  return (
    <>
      <div className="fixed left-0">
        <SideNav />
      </div>
      <div className="flex ml-16 overflow-hidden">
        <div className="flex-[2] h-screen border">
          {pdfFiles.length ? (
            <PdfTabs pdfFiles={pdfFiles} />
          ) : (
            <FileDropzone onFileUploaded={onFileUploaded} />
          )}
        </div>
        <div className="flex-1 h-screen">
          <ChatWindow />
        </div>
      </div>
    </>
  );
}
