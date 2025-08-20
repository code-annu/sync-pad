import { JWTPayload } from "../../model/jwt-model";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export {};
