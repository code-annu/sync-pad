import { Types } from "mongoose";
import { ProjectModel, Project } from "../model/project-model";
import { ProjectCreate } from "../types/project-types";

export class ProjectRepository {
  async saveProject(projectData: ProjectCreate): Promise<Project> {
    const project = new ProjectModel(projectData);
    const savedProject = await project.save();
    return savedProject.toObject();
  }

  async getProjectById(
    projectId: string | Types.ObjectId
  ): Promise<Project | null> {
    const project = await ProjectModel.findById(projectId);
    return project ? project.toObject() : null;
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
