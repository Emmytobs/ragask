import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { X } from "lucide-react";
import { PDF } from "./pdf";
import { FileDropzone } from "./FileDropZone";
import { useFileUpload } from "@/hooks/file-upload";
import { IFile } from "@/interfaces/IFile";
import { useEffect, useState } from "react";

type PdfTabsProps = {
  files: IFile[];
};

export function PdfTabs(props: PdfTabsProps) {
  const [pdfFiles, setPdfFiles] = useState(props.files)
  const { files, onFileUploaded } = useFileUpload()

  const onRemoveFileFromViewTab = (file: IFile) => {
    const updatedPdfFiles = pdfFiles.filter(f => f.name !== file.name);
    setPdfFiles(updatedPdfFiles);
  };

  useEffect(() => {
    if (files.length > 0) {
      setPdfFiles(files)
    }
  }, [files])


  return (
    pdfFiles.length > 0 ? (<Tabs defaultValue={pdfFiles[0].name}>
      <ScrollArea className="rounded-md">
        <TabsList className="items-center w-full justify-stretch">
          {pdfFiles.map((file) => (
            <TabsTrigger key={file.name} value={file.name} className="flex-1">
              <div className="flex w-full justify-between items-center gap-x-2">
                <span className="text-ellipsis">{file.name}</span>
                <X className="w-4 h-4" onClick={() => onRemoveFileFromViewTab(file)} />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pdfFiles.map((file) => (
        <TabsContent key={file.name} value={file.name}>
          <PDF fileUrl={file.storage_url}></PDF>
        </TabsContent>
      ))}
    </Tabs>)
      : (
        <FileDropzone onFileUploaded={onFileUploaded} />
      )
  );
}
