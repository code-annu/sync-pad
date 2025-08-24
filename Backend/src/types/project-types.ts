interface BaseProject {
  title: string;
  creatorId: string;
}

export interface ProjectCreate extends BaseProject {}

export interface ProjectResponse extends BaseProject {
  id: string;
  fileIds: string[];
  memberIds: string[];
}


