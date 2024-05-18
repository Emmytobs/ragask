import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { X } from "lucide-react";
import { PDF } from "./pdf";
import { PDFFile } from "@/app/page";

type PdfTabsProps = {
  pdfFiles: PDFFile[];
};

export function PdfTabs(props: PdfTabsProps) {
  const { pdfFiles } = props;
  return (
    <Tabs defaultValue={pdfFiles[0].name}>
      <ScrollArea className="rounded-md">
        <TabsList className="items-center w-full justify-stretch">
          {pdfFiles.map((file) => (
            <TabsTrigger key={file.name} value={file.name} className="flex-1">
              <div className="flex w-full justify-between items-center gap-x-2">
                <span className="text-ellipsis">{file.name}</span>
                <X className="w-4 h-4" />
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
    </Tabs>
  );
}
