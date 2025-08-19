import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth-service";

export class AuthController {
  private authService = new AuthService();

  async registerUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await this.authService.registerNewUser(userData);
      res.status(201).json(user);
    } catch (e) {
      const error = e as Error;
      res
        .status(400)
        .json({ message: "Failed to register new User", error: error.message });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await this.authService.loginUser(email, password);
      res.status(200).json(user);
    } catch (e) {
      const error = e as Error;
      res
        .status(400)
        .json({ message: "Failed to login User", error: error.message });
    }
  }
}
