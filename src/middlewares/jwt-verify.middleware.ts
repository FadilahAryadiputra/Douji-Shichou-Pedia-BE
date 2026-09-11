import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/app.error.js";

export class JwtVerify {
  static verifyToken(secretKey: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token || token === "null") {
        return next(new AppError("Bearer token is invalid or missing", 401));
      }

      try {
        const payload = jwt.verify(token, secretKey);

        res.locals.payload = payload;

        return next();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          return next(new AppError("Token has expired", 401));
        }

        if (error instanceof jwt.JsonWebTokenError) {
          return next(new AppError("Invalid token", 401));
        }

        return next(error);
      }
    };
  }
}
