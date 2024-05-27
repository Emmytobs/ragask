"use client";

import SideNav from "../components/sideNav";
import ChatWindow from "../components/chatWindow";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PdfTabs } from "../components/PdfTabs";
import { FileDropzone } from "@/components/FileDropZone";
import { useFileUpload } from "@/hooks/file-upload";



export default function Home() {
  const { files, onFileUploaded } = useFileUpload()

  return (
    <>
      <div className="fixed left-0">
        <SideNav />
      </div>
      <div className="flex ml-16 overflow-hidden">
        <div className="flex-[2] h-screen border">
          {files.length ? (
            <PdfTabs files={files} />
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
