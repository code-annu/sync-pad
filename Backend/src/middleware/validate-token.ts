import { Request,Response, NextFunction } from "express";
import { verifyAccessToken } from "../util/jwt-util";
// import Request from "../types/express/index";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token required",
    });
    return;
  }
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Access token expired",
        code: "TOKEN_EXPIRED",
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid access token",
        code: "TOKEN_INVALID",
      });
    }
  }
};
