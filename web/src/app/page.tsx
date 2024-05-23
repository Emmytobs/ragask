"use client";

import SideNav from "../components/sideNav";
import ChatWindow from "../components/chatWindow";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfTabs } from "../components/PdfTabs";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "./firebase";

export type PDFFile = {
  name: string;
  url: string;
};

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);

  const uploadToCloudStorage = async (
    file: File
  ): Promise<{ url: string } | undefined> => {
  console.log('File',file)
    const storageRef = ref(firebaseStorage, "document.pdf");
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { url };
    } catch (error) {
      console.log({ error });
    }
  };

  const onFileUploaded = async (files: File[]) => {
    const fileUrls: Array<Pick<PDFFile, "url">> = await Promise.all(
      files.map(
        (file) => uploadToCloudStorage(file) as Promise<{ url: string }>
      )
    );
    const pdfFiles: PDFFile[] = files.map(({ name }, index) => ({
      name,
      url: fileUrls[index].url,
    }));
    console.log("PdfFiles", pdfFiles);
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

{
  /* <>
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
</> */
}
export function FileDropzone({
  onFileUploaded,
}: {
  onFileUploaded: (uploadedFiles: File[]) => void;
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    onFileUploaded(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="h-full">
      <input {...getInputProps()} />
      <div className="h-full flex justify-center items-center">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center gap-y-2 cursor-pointer">
            <Upload size="30px" />
            Drag &amp; drop some files here, or click to select files
          </div>
        )}
      </div>
    </div>
  );
}
