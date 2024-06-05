"use client";

import SideNav from "../components/sideNav";
import ChatWindow from "../components/chatWindow";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfTabs } from "../components/PdfTabs";
import { FileDropzone } from "@/components/FileDropZone";
import { useFileUpload } from "@/hooks/file-upload";
import {  useEffect, useState } from "react";
import { IFile } from "@/interfaces/IFile";

export default function Home() {
  const { files, onFileUploaded, onRemoveFileFromViewTab } = useFileUpload();
  const [currentFile, setCurrentFile] = useState<IFile>(files[0]);

  useEffect(() => {
    setCurrentFile(files[0]);
  }, [files]);
  
  return (
    <>
      <div className="fixed left-0">
        <SideNav />
      </div>
      <div className="flex ml-16 overflow-hidden">
        <div className="flex-[2] h-screen border">
          {files.length && currentFile ? (
            <PdfTabs
              files={files}
              onFileUploaded={onFileUploaded}
              onRemoveFileFromViewTab={onRemoveFileFromViewTab}
              currentFile={currentFile}
              setCurrentFile={setCurrentFile}
            />
          ) : (
            <FileDropzone onFileUploaded={onFileUploaded} />
          )}
        </div>
        <div className="flex-1 h-screen">
          <ChatWindow currentFile={currentFile} />
        </div>
      </div>
    </>
  );
}
