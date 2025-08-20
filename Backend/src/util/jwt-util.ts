import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { JWTPayload } from "../model/jwt-model";
import { RefreshTokenModel, RefreshToken } from "../model/refresh-token-model";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const ACCESS_TOKEN_EXPIRE = (process.env.JWT_ACCESS_EXPIRE! ||
  "1h") as StringValue;

const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
const REFRESH_TOKEN_EXPIRE = (process.env.JWT_REFRESH_EXPIRE ||
  "7d") as StringValue;

export const generateAccessToken = (payload: JWTPayload): string =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

export const generateRefreshToken = (payload: JWTPayload): string =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

export const saveRefreshToken = async (
  token: string,
  userId: string
): Promise<RefreshToken> => {
  const refreshToken = new RefreshTokenModel({
    token: token,
    userId: userId,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
  });

  const savedToken = await refreshToken.save();
  return savedToken.toObject();
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
};

/*export interface JWTPayload {
  id: string;
  email: string;
  name: string;
}*/

/*export const generateJWTAndAttachToResponse = (
  res: Response,
  user: JWTPayload
): string => {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: parseInt(JWT_EXPIRY) * 1000,
    path: "/",
  });

  return token;
};*/
