import { Router } from "express";
import { FileController } from "../controller/file-controller";

export const fileRouter = Router({ mergeParams: true }); // Set mergeParams true access req.params
const fileController = new FileController();

fileRouter.post("/", fileController.filesPost.bind(fileController));
