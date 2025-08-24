import { ProjectController } from "../controller/project-controller";
import { Router } from "express";

export const projectRouter = Router();
const projectController = new ProjectController();

projectRouter.post("/", projectController.projectsPost.bind(projectController));

projectRouter.get(
  "/:projectId",
  projectController.projectsGet.bind(projectController)
);
