import { NextFunction, Request, Response } from "express";
import { AuthRegisterService } from "./services/register.service.js";
import { AuthLoginService } from "./services/login.service.js";
import { registerSchema } from "./schemas/register.schema.js";
import { loginSchema } from "./schemas/login.schema.js";

export class AuthController {
  private authRegisterService: AuthRegisterService;
  private authLoginService: AuthLoginService;

  constructor() {
    this.authRegisterService = new AuthRegisterService();
    this.authLoginService = new AuthLoginService();
  }

  userRegister = async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const result = await this.authRegisterService.userRegister(body);
    res.status(200).json(result);
  };

  userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = loginSchema.parse(req.body);
      const result = await this.authLoginService.userLogin(body);
      return res.status(200).json({
        message: "Account logged in successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
