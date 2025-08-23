import { Types } from "mongoose";
import { RefreshToken, RefreshTokenModel } from "../model/refresh-token-model";
import { RefreshTokenCreate } from "../types/refresh-token-types";

export class RefreshTokenRepository {
  async saveRefreshToken(newToken: RefreshTokenCreate): Promise<RefreshToken> {
    const refreshToken = new RefreshTokenModel(newToken);
    const savedToken = await refreshToken.save();
    return savedToken.toObject();
  }

  async deleteRefreshToken(token: string) {
    await RefreshTokenModel.deleteOne({ token: token });
  }

  async deleteRefreshTokenByUserId(userId: string | Types.ObjectId) {
    await RefreshTokenModel.deleteOne({ userId: userId });
  }

  async isRefreshTokenExists(token: string): Promise<boolean> {
    const foundToken = await RefreshTokenModel.findOne({ token: token });
    return foundToken != null;
  }
}
