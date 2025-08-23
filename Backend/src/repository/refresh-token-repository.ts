import { Types } from "mongoose";
import { RefreshToken, RefreshTokenModel } from "../model/refresh-token-model";
import { RefreshTokenCreate } from "../types/refresh-token-types";

export class RefreshTokenRespository {
  async saveRefreshToken(newToken: RefreshTokenCreate): Promise<RefreshToken> {
    try {
      const refreshToken = new RefreshTokenModel(newToken);
      const savedToken = await refreshToken.save();
      return savedToken.toObject();
    } catch (e) {
      throw e;
    }
  }

  async deleteRefreshToken(userId: string | Types.ObjectId) {
    try {
      await RefreshTokenModel.deleteOne({ userId: userId });
    } catch (e) {
      throw e;
    }
  }
}
