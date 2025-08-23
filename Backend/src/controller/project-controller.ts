import { ProjectService } from "../service/project-service";
import { mapToProjectResponse } from "../mappers/project-mapper";
import { Request, Response } from "express";
import { JWTPayload } from "../types/jwt-types";

export class ProjectController {
  private projectService = new ProjectService();

  async projectsPost(req: Request, res: Response) {
    try {
      const { projectTitle } = req.body;
      const user: JWTPayload = req.user;
      if (!projectTitle)
        throw Error("Invalid input received. Please provide projectTitle");
      const project = await this.projectService.createNewProject(
        projectTitle,
        user.userId.toString()
      );
      res.status(201).json(mapToProjectResponse(project));
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ status: "failed", message: error.message });
    }
  }
}
