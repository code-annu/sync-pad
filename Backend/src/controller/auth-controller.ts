import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { generateJWTAndAttachToResponse, JWTPayload } from "../util/jwt-util";

export class AuthController {
  private authService = new AuthService();

  async registerUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const user = await this.authService.createNewUser(userData);
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
      const user = await this.authService.getUser(email, password);
      const payload: JWTPayload = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
      const token = generateJWTAndAttachToResponse(res, payload);
      res.status(200).json({ user: user, access_token: token });
    } catch (e) {
      const error = e as Error;
      res
        .status(400)
        .json({ message: "Failed to login User", error: error.message });
    }
  }
}
