"use client"
import SideNav from "@/components/side-nav";
import ChatWindow from "@/components/chat/window";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfTabs } from "@/components/pdf/tabs";
import { FileDropzone } from "@/components/file-drop-zone";
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
          <div className="flex flex-col items-center justify-center h-screen">
            <FileDropzone onFileUploaded={onFileUploaded} />
          </div>
          )}
        </div>
        <div className="flex-1 h-screen">
          <ChatWindow currentFile={currentFile} />
        </div>
      </div>
    </>
  );
}
