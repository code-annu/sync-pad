import jwt from "jsonwebtoken";
import { Response } from "express";
import { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRY = (process.env.JWT_EXPIRY! || "1h") as StringValue;

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
}

export const generateJWTAndAttachToResponse = (
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
};
