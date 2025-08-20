import { Request, Response } from "express";
import { AuthService } from "../service/auth-service";
import { JWTPayload } from "../model/jwt-model";
import { UserService } from "../service/user-service";
import { RefreshTokenService } from "../service/refresh-token-service";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
} from "../util/jwt-util";

export class AuthController {
  private authService = new AuthService();
  private refreshTokenService = new RefreshTokenService();
  private userService = new UserService();

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
        userId: user._id.toString(),
        email: user.email,
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      await saveRefreshToken(refreshToken, payload.userId);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(200).json({
        user: user,
        refresh_token: refreshToken,
        access_token: accessToken,
      });
    } catch (e) {
      const error = e as Error;
      res
        .status(400)
        .json({ message: "Failed to login User", error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      console.log(req);
      console.log(req.body);
      let refreshToken = req.body.refreshToken || req.cookies.refreshToken;
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token not provided",
        });
        return;
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(refreshToken);
      } catch (error) {
        res.status(401).json({
          success: false,
          message: "Invalid refresh token. Try to login again",
        });
        return;
      }

      const storedToken = await this.refreshTokenService.findRefreshToken(
        refreshToken
      );
      if (!storedToken) {
        res.status(401).json({
          success: false,
          message: "Refresh token not found",
        });
        return;
      }

      let user = await this.userService.findUserByEmail(decoded.email);
      await this.refreshTokenService.invalidateRefreshToken(refreshToken);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found!",
        });
        return;
      }

      const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
      };
      refreshToken = generateRefreshToken(payload);
      const accessToken = generateAccessToken(payload);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: accessToken,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(401).json({
        success: false,
        message: (e as Error).message,
      });
      return;
    }
  }
}
