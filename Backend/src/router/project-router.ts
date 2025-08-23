import { ProjectController } from "../controller/project-controller";
import { Router } from "express";

export const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.post(
  "/projects",
  projectController.projectsPost.bind(projectController)
);
