import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const authValidate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
