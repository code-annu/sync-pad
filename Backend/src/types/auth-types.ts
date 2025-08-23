export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    projectIds: string[];
    requestIds: string[];
  };
  refreshToken: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
  };
  accessToken: string;
}

export interface RefreshTokenResponse {
  refreshToken: {
    id: string;
    token: string;
    userId: string;
    expiresAt: Date;
  };
  accessToken: string;
}
