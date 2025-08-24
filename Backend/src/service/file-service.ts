import { File } from "../model/file-model";
import { User } from "../model/user-model";
import { FileRepository } from "../repository/file-repository";
import { ProjectRepository } from "../repository/project-repository";
import { UserRepository } from "../repository/user-repository";
import { FileCreate } from "../types/file-type";

export class FileService {
  private fileRepository = new FileRepository();
  private projectRepository = new ProjectRepository();
  private userRepository = new UserRepository();

  async createNewFileInProject(
    projectId: string,
    creatorId: string,
    fileData: FileCreate
  ): Promise<[File, User]> {
    const fileCreator = await this.userRepository.getUserById(creatorId);
    if (!fileCreator) throw Error(`Creator with id ${creatorId} not found!`);

    const project = await this.projectRepository.getProjectById(projectId);
    if (!project) throw Error(`Project with id ${projectId} not found`);

    if (
      !project.memberIds
        .map((memberId) => memberId.toString())
        .includes(creatorId) &&
      project.creatorId.toString() != creatorId
    ) {
      throw Error(
        "You have to be a member or creator of this project to add files."
      );
    }

    const file = await this.fileRepository.saveFile({
      ...fileData,
      creatorId: creatorId,
    });

    await this.projectRepository.addFileId(projectId, file._id);

    return [file, fileCreator];
  }
}
