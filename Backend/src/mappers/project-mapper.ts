import { ProjectResponse } from "../types/project-types";
import { Project } from "../model/project-model";
import { User } from "../model/user-model";
import { ProjectDetailResponse } from "../response/project-response";
import { string } from "zod";

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

export function mapToProjectDetailsResponse(
  project: Project,
  projectCreator: User,
  projectMembers: User[]
) {
  const members: { id: string; name: string }[] = [];
  for (const member of projectMembers) {
    members.push({
      id: member._id.toString(),
      name: member.name,
    });
  }
  const projectDetailResponse: ProjectDetailResponse = {
    id: project._id.toString(),
    title: project.title,
    creator: { id: projectCreator._id.toString(), name: projectCreator.name },
    members: members,
    createdAt: project.createdAt,
  };

  return projectDetailResponse;
}
