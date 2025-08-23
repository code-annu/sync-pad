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

      res.status(201).json({
        user: user,
        refreshTokenData: refreshTokenData,
        accessToken: accessToken,
      });
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
          message: "Invalid inputs. Please proivde email and password",
        });
      }

      const [user, refreshTokenData, accessToken] =
        await this.authService.loginUser(email, password);

      res.status(200).json({
        user: user,
        refreshTokenData: refreshTokenData,
        accessToken: accessToken,
      });
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
      if (!user) {
        res.status(401).json({
          success: false,
          message: "User not found!",
        });
        return;
      }

      await this.refreshTokenService.invalidateRefreshToken(refreshToken);
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
