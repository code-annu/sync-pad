import { AuthController } from "../controller/auth-controller";
import { Router } from "express";
import { authValidation as authValidate } from "../middleware/auth-validate";
import { registerSchema, loginSchema } from "../schema/auth-schema";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post(
  "/register",
  authValidate(registerSchema),
  authController.registerUser.bind(authController)
);

authRouter.post(
  "/login",
  authValidate(loginSchema),
  authController.loginUser.bind(authController)
);
