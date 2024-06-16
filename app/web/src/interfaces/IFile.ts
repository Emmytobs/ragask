export type ICreateFileApi = {
    name: string;
    storage_id: string;
    type: string;
    size: number
};

export type IFile = {
    id: string;
    name: string;
    storage_url: string
    storage_id: string;
    type: string;
    size: number
};
