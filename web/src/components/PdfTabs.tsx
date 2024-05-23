import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

import { X } from "lucide-react";
import { PDF } from "./pdf";
import { FileDropzone, PDFFile } from "../app/page";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firebaseStorage } from "../app/firebase";

type PdfTabsProps = {
  pdfFiles: PDFFile[];
};

export function PdfTabs(props: PdfTabsProps) {
  const [pdfFiles, setPdfFiles] = useState(props.pdfFiles);

  const onRemovePdf = (file: PDFFile) => {
    const updatedPdfFiles = pdfFiles.filter(f => f.name !== file.name);
    setPdfFiles(updatedPdfFiles); 
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

   const onFileUploaded = async (files: File[]) => {
    const fileUrls: Array<Pick<PDFFile, "url">> = await Promise.all(
      files.map(
        (file) => uploadToCloudStorage(file) as Promise<{ url: string }>
      )
    );
    const pdfFiles: PDFFile[] = files.map((file, index) => ({
      name: file.name,
      url: fileUrls[index].url,

    }));
    console.log('PdfFiles', pdfFiles);
    setPdfFiles(pdfFiles);
  };

  return (
    pdfFiles.length > 0 ? (<Tabs defaultValue={pdfFiles[0].name}>
      <ScrollArea className="rounded-md">
        <TabsList className="items-center w-full justify-stretch">
          {pdfFiles.map((file) => (
            <TabsTrigger key={file.name} value={file.name} className="flex-1">
              <div className="flex w-full justify-between items-center gap-x-2">
                <span className="text-ellipsis">{file.name}</span>
                <X className="w-4 h-4" onClick={() => onRemovePdf(file)} />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pdfFiles.map((files) => (
        <TabsContent key={files.name} value={files.name}>
          <PDF fileUrl={files.url}></PDF>
        </TabsContent>
      ))}
    </Tabs>)
    :(
        <FileDropzone onFileUploaded={onFileUploaded} />
    )
  );
}
