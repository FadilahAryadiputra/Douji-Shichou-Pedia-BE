import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/app.error.js";
import { LoggerService } from "../utils/logger.js";

export class ErrorHandlerMiddleware {
  private static logger = new LoggerService();

  public static handle(): ErrorRequestHandler {
    return (error: any, req: Request, res: Response, _: NextFunction): void => {
      const isJwtError =
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError";

      const isZodError = error instanceof ZodError;

      const statusCode =
        error.statusCode || (isJwtError ? 401 : isZodError ? 400 : 500);

      const message = isZodError
        ? error.issues[0]?.message || "Invalid request data"
        : error instanceof AppError || error.isOperational
          ? error.message
          : isJwtError
            ? error.message
            : "Internal server error. Please try again later!";

      this.logger.error(`${req.method} ${req.url} - ${message}`, {
        name: error.name,
        stack: error.stack,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        statusCode,
      });

      if (req.path.includes("/api/")) {
        res.status(statusCode).json({
          success: false,
          message,
        });

        return;
      }
    };
  }
}
