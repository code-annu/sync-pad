export interface RefreshTokenCreate {
  token: string;
  userId: string;
  expiresAt: Date;
}
