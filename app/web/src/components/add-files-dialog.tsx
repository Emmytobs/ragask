"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileDropzone } from "@/components/file-drop-zone";
import { Icons } from "@/components/icons";
import { useFileUpload } from "@/hooks/file-upload";
import Loading from "@/components/loading";

function AddFilesDialog() {
  const { onFileUploaded, isUploading } = useFileUpload();
  const handleFileUpload = async (files: File[]) => {
    onFileUploaded(files);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Icons.fileUpload color="black" />
      </DialogTrigger>
      <DialogContent>
        {isUploading ? (
          <div className="flex items-center justify-center h-32">
            <Loading />
          </div>
        ) : (
          <DialogHeader>
            <DialogTitle>Add Files</DialogTitle>
            <DialogDescription>
              <FileDropzone onFileUploaded={handleFileUpload} />
            </DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddFilesDialog;
