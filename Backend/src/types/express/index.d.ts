import { JWTPayload } from "../jwt-types";

declare global {
  namespace Express {
    interface Request {
      user: JWTPayload;
    }
  }
}

export {};
