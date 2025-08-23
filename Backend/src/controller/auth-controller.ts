import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import {
  mapToAuthResponse,
  mapToRefreshTokenResponse,
} from "../mappers/auth-mapper";

export class AuthController {
  private authService = new AuthService();

  async registerPost(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        res.status(400).json({
          message: "Invalid inputs. Please proivde email, password and name",
        });
      }
      const [user, refreshTokenData, accessToken] =
        await this.authService.registerNewUser({
          email: email,
          password: password,
          name: name,
        });

      res
        .status(201)
        .json(mapToAuthResponse(user, refreshTokenData, accessToken));
    } catch (e) {
      const error = e as Error;
      res.status(400).json({
        message: "Failed to register new User",
        error: error.message,
      });
    }
  }

  async loginPost(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({
          message: "Invalid inputs. Please provide email and password",
        });
      }

      const [user, refreshTokenData, accessToken] =
        await this.authService.loginUser(email, password);

      res
        .status(200)
        .json(mapToAuthResponse(user, refreshTokenData, accessToken));
    } catch (e) {
      const error = e as Error;
      res.status(400).json({
        message: "Failed to Login",
        error: error.message,
      });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw Error("Refresh token is required");
      const [refreshTokenData, accessToken] =
        await this.authService.refreshAccessToken(refreshToken);

      res
        .status(200)
        .json(mapToRefreshTokenResponse(refreshTokenData, accessToken));
    } catch (e) {
      const error = e as Error;
      res.status(400).json({ message: error.message, status: "failed" });
    }
  }
}
