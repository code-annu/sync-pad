import { UserRepository } from "../repository/user-repository";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { UserCreate } from "../types/user-types";
import { JWTPayload } from "../types/jwt-types";
import { generateAccessToken, generateRefreshToken } from "../util/jwt-util";
import { RefreshTokenRespository } from "../repository/refresh-token-repository";
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
  private uesrRepository = new UserRepository();
  private refreshTokenRepository = new RefreshTokenRespository();

  async registerNewUser(newUser: {
    email: string;
    password: string;
    name: string;
  }): Promise<[User, RefreshToken, string]> {
    try {
      const user = await this.uesrRepository.getUserByEmail(newUser.email);
      if (user) throw Error(EMAIL_ALREADY_REGISTERED_MESSAGE);

      const passwordHash = await bcrypt.hash(newUser.password, SALT_NUM);
      const userData: UserCreate = {
        email: newUser.email,
        passwordHash: passwordHash,
        name: newUser.name,
      };
      const savedUser = await this.uesrRepository.saveUser(userData);
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

  async createNewUser(newUser: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> {
    try {
      var user = await UserModel.findOne({ email: newUser.email });
      if (user) throw Error(EMAIL_ALREADY_REGISTERED_MESSAGE);

      const password_hash = await bcrypt.hash(newUser.password, SALT_NUM);
      const project_ids: Types.ObjectId[] = [];

      const userCreated = await UserModel.create({
        email: newUser.email,
        password_hash: password_hash,
        name: newUser.name,
        project_ids: project_ids,
      });
      return userCreated.toObject();
    } catch (e) {
      throw e;
    }
  }

  async getUser(email: string, password: string) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) throw Error(EMAIL_NOT_FOUND);

      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) throw Error(INVALID_PASSWORD);

      return user;
    } catch (e) {
      throw e;
    }
  }
}
