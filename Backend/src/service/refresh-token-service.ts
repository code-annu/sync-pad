import { RefreshTokenModel, RefreshToken } from "../model/refresh-token-model";

export class RefreshTokenService {
  async saveRefreshToken(token: string, userId: string): Promise<RefreshToken> {
    const refreshToken = new RefreshTokenModel({
      token: token,
      userId: userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
    });
    try {
      const savedToken = await refreshToken.save();
      return savedToken.toObject();
    } catch (e) {
      throw e;
    }
  }

  async findRefreshToken(token: string): Promise<RefreshToken> {
    try {
      const storedToken = await RefreshTokenModel.findOne({ token: token });
      if (!storedToken) throw Error("Refresh token not found!");

      return storedToken.toObject();
    } catch (e) {
      throw e;
    }
  }

  async invalidateRefreshToken(token: string) {
    try {
      await RefreshTokenModel.deleteOne({ token: token });
    } catch (e) {
      throw e;
    }
  }
}
