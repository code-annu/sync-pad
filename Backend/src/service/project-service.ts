import { ProjectCreateRequest, ProjectResponse } from "../types/project-types";
import { UserModel } from "../model/user-model";
import { Project } from "../model/project-model";
import { mapProjectDocumentToProjectResponse } from "../mappers/project-mapper";

export class ProjectService {
  async createNewProject(
    projectData: ProjectCreateRequest
  ): Promise<ProjectResponse> {
    try {
      const user = await UserModel.findById(projectData.creatorId);
      if (!user)
        throw Error(`User with id: ${projectData.creatorId} not found!`);

      if (user.projectIds.length >= 5)
        throw Error("You have reached the maximum limit of projects");

      const project = new Project({
        ...projectData,
      });
      const savedProject = (await project.save()).toObject();

      await UserModel.findByIdAndUpdate(
        projectData.creatorId,
        { $addToSet: { projectIds: savedProject._id } }, // Append projectIds array with Safely avoid duplicates: $addToSet
        { new: true }
      );

      return mapProjectDocumentToProjectResponse(savedProject);
    } catch (e) {
      throw e;
    }
  }

  async deleteProject(projectId: string, userId: string) {
    try {
      const project = await Project.findById(projectId);
      if (!project) throw Error(`Project with id ${projectId} not found!`);

      if (project.creatorId === userId) {
        await Project.findByIdAndDelete(projectId);
        await UserModel.findByIdAndUpdate(userId, {
          $pull: { projectIds: projectId },
        });
      } else {
        throw Error(
          "You are not authorized to delete this project. Only creator can delete projects."
        );
      }
    } catch (e) {
      throw e;
    }
  }
}
