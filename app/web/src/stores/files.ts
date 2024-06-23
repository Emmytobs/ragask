import { IFile } from '@/interfaces/IFile';
import { create } from 'zustand';

type FileStore = {
  files: IFile[];
  addFiles: (files: IFile[]) => void;
  removeFile: (file: IFile) => void;
};

const useFileStore = create<FileStore>((set) => ({
  files: [],
  addFiles: (files: IFile[]) => {
    set((state) => {
      const existingFileNames = new Set(state.files.map((f) => f.name));
      const newFiles = files.filter((file) => !existingFileNames.has(file.name));
      return {
        files: [...state.files, ...newFiles],
      };
    });;
  },
  removeFile: (file: IFile) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== file.id),
    }));
  },
}));

export default useFileStore;