import { mapToFileResponse } from "../mappers/file-mapper";
import { FileService } from "../service/file-service";
import { Request, Response } from "express";

export class FileController {
  private fileService = new FileService();
  async filesPost(req: Request, res: Response) {
    try {
      const user = req.user;
      const { projectId } = req.params;
      if (!projectId) throw Error("Invalid inputs. Project id is required");

      const { content: fileContent, name: fileName } = req.body;

      if (!fileContent || !fileName)
        throw Error("File content and name is required");

      const [file, creator] = await this.fileService.createNewFileInProject(
        projectId,
        user.userId,
        {
          content: fileContent,
          name: fileName,
        }
      );
      res.status(201).json(mapToFileResponse(file, creator));
    } catch (e) {
      console.log(e);
      const error = e as Error;
      res.status(400).json({ status: "failed", message: error.message });
    }
  }
}
