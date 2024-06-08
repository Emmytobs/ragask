import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

function FileDropzone({
  onFileUploaded,
}: {
  onFileUploaded: (uploadedFiles: File[]) => void;
}) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileUploaded(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="h-full flex justify-center items-center">
        {isDragActive ? (
          <p>Drop the files here...</p>
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

export { FileDropzone }