import { ProjectResponse } from "../types/project-types";
import { Project } from "../model/project-model";

export function mapToProjectResponse(project: Project) {
  const projectResponse: ProjectResponse = {
    id: project._id.toString(),
    title: project.title,
    fileIds: project.fileIds.map((fileId) => fileId.toString()),
    memberIds: project.memberIds.map((memberId) => memberId.toString()),
    creatorId: project.creatorId.toString(),
  };

  return projectResponse;
}
