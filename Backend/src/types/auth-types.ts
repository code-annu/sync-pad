export interface AuthReponse {
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
