"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/MyTextArea";
import ChatMessage from "@/components/ChatMessage";
import SideNav from "@/components/sideNav";
import { Separator } from "@/components/ui/separator";
import DocumentList from "@/components/documentList";
import ChatWindow from "@/components/chatWindow";
import { PDF } from "@/components/pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfTabs } from "@/components/PdfTabs";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

export type PDFFile = {
  name: string;
  url: string;
};

export default function Home() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);

  const onFileUploaded = (files: File[]) => {
    const pdfFiles: PDFFile[] = files.reduce(
      (acc: PDFFile[], currFile: File) => {
        const url = URL.createObjectURL(currFile);
        const name = currFile.name;
        acc.push({ name, url });
        return acc;
      },
      []
    );

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

function FileDropzone({
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
