import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { X } from "lucide-react";
import { PDF } from "./pdf";

export function TabsDemo() {
  const pdfFiles = [
    {
      value: "first",
      name: "First.pdf",
    },
    {
      value: "second",
      name: "Second.pdf",
    },
    {
      value: "third",
      name: "Third.pdf",
    },
    {
      value: "fourth",
      name: "Fourth.pdf",
    },
    {
      value: "fifth",
      name: "Fifth.pdf",
    },
    {
      value: "sixth",
      name: "Sixth.pdf",
    },
    {
      value: "seven",
      name: "Seventh.pdf",
    },
  ];
  return (
    <Tabs defaultValue={pdfFiles[3].value}>
      <ScrollArea className="ml-16 w-9/12 rounded-md">
      <TabsList className="items-center">
        {pdfFiles.map((file) => (
          <TabsTrigger key={file.value} value={file.value}>
          <div className="flex items-center space-x-2">
            <X className="w-4 h-4" />
            {file.name}
          </div>
          </TabsTrigger>
        ))}
      </TabsList>
      <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {pdfFiles.map((files) => (
      <TabsContent key= {files.value} value={files.value}>
        <PDF></PDF>
      </TabsContent>
      ))}
    </Tabs>
  );
}
