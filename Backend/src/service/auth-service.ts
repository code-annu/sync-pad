import { UserRepository } from "../repository/user-repository";
import bcrypt from "bcrypt";
import { UserCreate } from "../types/user-types";
import { JWTPayload } from "../types/jwt-types";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../util/jwt-util";
import { RefreshTokenRepository } from "../repository/refresh-token-repository";
import { RefreshTokenCreate } from "../types/refresh-token-types";
import { User } from "../model/user-model";
import { RefreshToken } from "../model/refresh-token-model";
import { UserModel } from "../model/user-model";

const EMAIL_ALREADY_REGISTERED_MESSAGE =
  'This email address is already registered. Please log in, or use the "Forgot Password?" link if you need to reset your password.';

const EMAIL_NOT_FOUND = "Email not found!";
const INVALID_PASSWORD = "Invalid password!";

const SALT_NUM = 10;
export class AuthService {
  private userRepository = new UserRepository();
  private refreshTokenRepository = new RefreshTokenRepository();

  async registerNewUser(newUser: {
    email: string;
    password: string;
    name: string;
  }): Promise<[User, RefreshToken, string]> {
    try {
      const user = await this.userRepository.getUserByEmail(newUser.email);
      if (user) throw Error(EMAIL_ALREADY_REGISTERED_MESSAGE);

      const passwordHash = await bcrypt.hash(newUser.password, SALT_NUM);
      const userData: UserCreate = {
        email: newUser.email,
        passwordHash: passwordHash,
        name: newUser.name,
      };
      const savedUser = await this.userRepository.saveUser(userData);

      const payload: JWTPayload = {
        email: savedUser.email,
        userId: savedUser.name,
      };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const refreshTokenData: RefreshTokenCreate = {
        token: refreshToken,
        userId: savedUser._id.toString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      const savedRefreshToken =
        await this.refreshTokenRepository.saveRefreshToken(refreshTokenData);

      return [savedUser, savedRefreshToken, accessToken];
    } catch (e) {
      throw e;
    }
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<[User, RefreshToken, string]> {
    try {
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) throw Error(EMAIL_NOT_FOUND);

      const match = bcrypt.compare(password, user.passwordHash);
      if (!match) throw Error(INVALID_PASSWORD);

      this.refreshTokenRepository.deleteRefreshTokenByUserId(
        user._id.toString()
      );

      const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
      };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const refreshTokenData: RefreshTokenCreate = {
        token: refreshToken,
        userId: user._id.toString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      const savedRefreshToken =
        await this.refreshTokenRepository.saveRefreshToken(refreshTokenData);

      return [user, savedRefreshToken, accessToken];
    } catch (e) {
      throw e;
    }
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<[RefreshToken, string]> {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const refreshTokenExists =
        await this.refreshTokenRepository.isRefreshTokenExists(refreshToken);
      if (!refreshTokenExists)
        throw Error("Refresh token is not found in database!");

      const user = await this.userRepository.getUserByEmail(decoded.email);
      if (!user)
        throw Error(
          "User not found! User deleted or deactivated their account"
        );

      await this.refreshTokenRepository.deleteRefreshToken(refreshToken);

      const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
      };

      const accessToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);

      const refreshTokenData: RefreshTokenCreate = {
        token: newRefreshToken,
        userId: user._id.toString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      const savedRefreshToken =
        await this.refreshTokenRepository.saveRefreshToken(refreshTokenData);

      return [savedRefreshToken, accessToken];
    } catch (e) {
      throw e;
    }
  }
}
