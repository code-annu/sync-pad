export interface FileResponse {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
  creator: {
    id: string;
    name: string;
  };
}

export interface ProjectFileResponse {
  id: string;
  name: string;
}
