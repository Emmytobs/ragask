import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { X } from "lucide-react";
import { PDF } from "./viewer";
import { FileDropzone } from "../file-drop-zone";
import { IFile } from "@/interfaces/IFile";
import useFileStore from "@/stores/files";

type PdfTabsProps = {
  files: IFile[];
  onFileUploaded: (files: File[]) => Promise<{ files: IFile[] }>;
  currentFile: IFile;
  setCurrentFile: (file: IFile) => void;
  currentPage: number;
};

export function PdfTabs(props: PdfTabsProps) {
  const {
    files: pdfFiles,
    onFileUploaded,
    currentFile,
    setCurrentFile,
    currentPage
  } = props;

  const removeFileFromTab = useFileStore(({ removeFile }) => removeFile)

  return pdfFiles.length > 0 ? (
    <Tabs
      defaultValue={currentFile.name}
      onValueChange={(value) => {
        const file = pdfFiles.find((f) => f.name === value);
        if (file) {
          setCurrentFile(file);
        }
      }}
      value={currentFile.name}
    >
      <ScrollArea className="rounded-md">
        <TabsList className="items-center w-full justify-stretch">
          {pdfFiles.map((file, index) => (
            <TabsTrigger key={index} value={file.name} className="flex-1">
              <div className="flex w-full justify-between items-center gap-x-2">
                <span className="text-ellipsis">{file.name}</span>
                <X
                  className="w-4 h-4"
                  onClick={() => removeFileFromTab(file)}
                />
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pdfFiles.map((file) => (
        <TabsContent key={file.name} value={file.name}>
          <PDF fileUrl={file.storage_url} currentPage={currentPage} />
        </TabsContent>
      ))}
    </Tabs>
  ) : (
    <FileDropzone onFileUploaded={onFileUploaded} />
  );
}
