import { RefreshToken } from "../model/refresh-token-model";
import { User } from "../model/user-model";
import { AuthResponse, RefreshTokenResponse } from "../types/auth-types";

export function mapToAuthResponse(
  user: User,
  refreshTokenData: RefreshToken,
  accessToken: string
): AuthResponse {
  const authResponse: AuthResponse = {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      projectIds: user.projectIds.map((projectId) => projectId.toString()),
      requestIds: user.requests
        ? user.requests.map((requestId) => requestId.toString())
        : [],
    },
    refreshToken: {
      id: refreshTokenData._id.toString(),
      token: refreshTokenData.token,
      userId: refreshTokenData.userId._id.toString(),
      expiresAt: refreshTokenData.expiresAt,
    },
    accessToken: accessToken,
  };

  return authResponse;
}

export function mapToRefreshTokenResponse(
  refreshTokenData: RefreshToken,
  accessToken: string
): RefreshTokenResponse {
  const refreshTokenResponse: RefreshTokenResponse = {
    refreshToken: {
      id: refreshTokenData._id.toString(),
      token: refreshTokenData.token,
      userId: refreshTokenData.userId.toString(),
      expiresAt: refreshTokenData.expiresAt,
    },
    accessToken: accessToken,
  };

  return refreshTokenResponse;
}
