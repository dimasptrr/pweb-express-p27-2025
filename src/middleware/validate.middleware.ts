import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format error dengan path field
        const errorMessages = error.issues
          .map((issue) => {
            const path = issue.path.join(".");
            return `${path}: ${issue.message}`;
          })
          .join("; ");
        
        return res.status(400).json({
          success: false,
          message: errorMessages,
          data: {},
        });
      }
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        data: {},
      });
    }
  };
