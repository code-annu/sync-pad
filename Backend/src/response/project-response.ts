export interface ProjectDetailResponse {
  id: string;
  title: string;
  members: { id: string; name: string }[];
  creator: {
    id: string;
    name: string;
  };
  //   files: { id: string; name: string }[];
  createdAt: Date;
}
