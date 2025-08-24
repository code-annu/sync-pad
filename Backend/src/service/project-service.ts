import { Project, ProjectModel } from "../model/project-model";
import { User } from "../model/user-model";
import { ProjectRepository } from "../repository/project-repository";
import { UserRepository } from "../repository/user-repository";

export class ProjectService {
  private projectRepository = new ProjectRepository();
  private userRepository = new UserRepository();

  async createNewProject(title: string, creatorId: string): Promise<Project> {
    try {
      const user = await this.userRepository.getUserById(creatorId);
      if (!user) throw Error(`User with id: ${creatorId} not found!`);

      if (user.projectIds.length >= 5)
        throw Error("You have reached the maximum limit of projects");

      const project = new ProjectModel({ title: title, creatorId: creatorId });
      const savedProject = await project.save();
      await this.userRepository.addProjectId(creatorId, savedProject._id);

      return savedProject.toObject();
    } catch (e) {
      throw e;
    }
  }

  async getProjectDetails(projectId: string): Promise<[Project, User, User[]]> {
    const project = await this.projectRepository.getProjectById(projectId);
    if (!project) throw Error(`Project with id ${projectId} not found`);

    const creator = await this.userRepository.getUserById(project.creatorId);
    if (!creator)
      throw Error(
        "Project creator not found. Account may deleted or deactivated."
      );

    const projectMembers: User[] = [];
    for (const memberId of project.memberIds) {
      const member = await this.userRepository.getUserById(memberId);
      if (member) projectMembers.push(member);
    }

    return [project, creator, projectMembers];
  }

  /*async deleteProject(projectId: string, userId: string) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) throw Error(`Project with id ${projectId} not found!`);

      if (project.creatorId === userId) {
        await ProjectModel.findByIdAndDelete(projectId);
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
  }*/
}
