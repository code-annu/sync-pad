import { AuthController } from "../controller/auth-controller";
import { Router } from "express";
import { authValidation } from "../middleware/auth-validate";
import { registerSchema, loginSchema } from "../schema/auth-schema";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post(
  "/register",
  authValidation(registerSchema),
  authController.registerUser.bind(authController)
);

authRouter.post(
  "/login",
  authValidation(loginSchema),
  authController.loginUser.bind(authController)
);
