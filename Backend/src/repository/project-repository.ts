import { Types } from "mongoose";
import { ProjectModel, Project } from "../model/project-model";
import { ProjectCreate } from "../types/project-types";

export class ProjectRepository {
  async createProject(projectData: ProjectCreate): Promise<Project> {
    const project = new ProjectModel(projectData);
    const savedProject = await project.save();
    return savedProject.toObject();
  }

  async addFileId(
    projectId: Types.ObjectId | string,
    fileId: Types.ObjectId | string
  ): Promise<Project | null> {
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $addToSet: { fileIds: fileId } },
      { new: true }
    );
    return updatedProject ? updatedProject.toObject() : null;
  }

  async removeFileId(
    projectId: Types.ObjectId | string,
    fileId: Types.ObjectId | string
  ): Promise<Project | null> {
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      projectId,
      { $pull: { fileIds: fileId } },
      { new: true }
    );
    return updatedProject ? updatedProject.toObject() : null;
  }
}
