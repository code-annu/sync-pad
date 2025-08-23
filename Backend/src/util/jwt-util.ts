import jwt from "jsonwebtoken";
import { StringValue } from "ms";
import { JWTPayload } from "../types/jwt-types";

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

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
};
