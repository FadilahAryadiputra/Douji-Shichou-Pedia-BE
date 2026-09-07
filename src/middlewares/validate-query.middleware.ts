import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/app.error.js";

export const validateQuery = (schema: z.ZodType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return next(new AppError(message, 400));
    }

    req.query = result.data as Request["query"];

    next();
  };
};
